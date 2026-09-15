<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookController extends Controller
{
    public function favorites(Request $request)
    {
        $books = Book::with(['author', 'genre', 'availability'])
            ->withAvg('ratings', 'rating')
            ->whereIn('id', DB::table('book_favorites')
                ->where('user_id', $request->user()->id)
                ->orderByDesc('created_at')
                ->pluck('book_id'))
            ->get()
            ->map(fn (Book $book) => [
                'id' => $book->id,
                'title' => $book->title,
                'page_count' => $book->page_count,
                'publication_year' => $book->publication_year,
                'publisher' => $book->publisher,
                'readers_count' => $book->readers_count,
                'rating' => (float) ($book->ratings_avg_rating ?? 0),
                'cover_url' => $book->cover_url
                    ? (str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/'.$book->cover_url))
                    : null,
                'author' => $book->author,
                'genre' => $book->genre,
                'availability' => $book->availability,
            ]);

        $availableBooks = Book::with('author')
            ->whereNotIn('id', $books->pluck('id'))
            ->orderBy('title')
            ->get()
            ->map(fn (Book $book) => [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author?->name,
                'cover_url' => $book->cover_url
                    ? (str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/'.$book->cover_url))
                    : null,
            ]);

        return Inertia::render('estante', ['books' => $books, 'availableBooks' => $availableBooks]);
    }

    public function show(Request $request, int $id)
    {
        $book = Book::with(['author', 'genre', 'availability'])
            ->withAvg('ratings', 'rating')
            ->findOrFail($id);
        $similarBooks = Book::with(['author', 'genre', 'availability'])
            ->withAvg('ratings', 'rating')
            ->where('fk_genre_id', $book->fk_genre_id)
            ->whereKeyNot($book->id)
            ->latest()
            ->limit(3)
            ->get();
        $userRating = DB::table('book_ratings')
            ->where('user_id', $request->user()->id)
            ->where('book_id', $book->id)
            ->first(['rating', 'comment']);
        $comments = BookRating::with('user:id,name')
            ->where(fn ($query) => $query->where('user_id', $request->user()->id)
                ->orWhereHas('user', fn ($user) => $user->where('public_reviews', true)))
            ->where('book_id', $book->id)
            ->whereNotNull('comment')
            ->where('comment', '!=', '')
            ->latest()
            ->get()
            ->map(fn (BookRating $rating) => [
                'id' => $rating->id,
                'author' => $rating->user?->name ?? 'Leitor',
                'rating' => $rating->rating,
                'comment' => $rating->comment,
                'can_delete' => $rating->user_id === $request->user()->id,
            ]);

        $details = [
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
                'description' => $book->description,
                'page_count' => $book->page_count,
                'publication_year' => $book->publication_year,
                'publisher' => $book->publisher,
                'rating' => (float) ($book->ratings_avg_rating ?? 0),
                'readers_count' => $book->readers_count ?? 0,
                'is_favorite' => DB::table('book_favorites')
                    ->where('user_id', $request->user()->id)
                    ->where('book_id', $book->id)
                    ->exists(),
                'user_rating' => $userRating?->rating,
                'user_comment' => $userRating?->comment,
                'cover_url' => $book->cover_url
                    ? (str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/'.$book->cover_url))
                    : null,
                'author' => $book->author,
                'genre' => $book->genre,
                'availability' => $book->availability,
            ],
            'similarBooks' => $similarBooks->map(fn (Book $similarBook) => [
                'id' => $similarBook->id,
                'title' => $similarBook->title,
                'cover_url' => $similarBook->cover_url
                    ? (str_starts_with($similarBook->cover_url, 'http') ? $similarBook->cover_url : asset('storage/'.$similarBook->cover_url))
                    : null,
                'rating' => (float) ($similarBook->ratings_avg_rating ?? 0),
                'author' => $similarBook->author,
            ]),
            'comments' => $comments,
        ];

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json($details);
        }

        return Inertia::render('bookDetails', $details);
    }

    public function toggleFavorite(Request $request, int $id)
    {
        $book = Book::findOrFail($id);
        $key = ['user_id' => $request->user()->id, 'book_id' => $book->id];

        if ($request->isMethod('put')) {
            DB::table('book_favorites')->insertOrIgnore($key + ['created_at' => now(), 'updated_at' => now()]);

            return back();
        }

        if ($request->isMethod('delete')) {
            DB::table('book_favorites')->where($key)->delete();

            return back();
        }

        $favorite = DB::table('book_favorites')
            ->where('user_id', $request->user()->id)
            ->where('book_id', $book->id)
            ->first();

        if ($favorite) {
            DB::table('book_favorites')->where('id', $favorite->id)->delete();

            return back();
        }

        DB::table('book_favorites')->insert([
            'user_id' => $request->user()->id,
            'book_id' => $book->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back();
    }

    public function rate(Request $request, int $id)
    {
        Book::findOrFail($id);
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $values = [
            'rating' => $validated['rating'],
            'updated_at' => now(),
            'created_at' => now(),
        ];

        if ($request->has('comment')) {
            $values['comment'] = blank($validated['comment'] ?? null) ? null : trim($validated['comment']);
        }

        DB::table('book_ratings')->updateOrInsert(
            ['user_id' => $request->user()->id, 'book_id' => $id],
            $values,
        );

        return back();
    }

    public function deleteComment(Request $request, int $bookId, int $ratingId)
    {
        BookRating::where('id', $ratingId)
            ->where('book_id', $bookId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail()
            ->update(['comment' => null]);

        return back();
    }
}
