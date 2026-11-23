<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\ReadingRule;
use App\Services\BookListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, BookListing $listing)
    {
        $userId = $request->user()?->id;
        $filters = $listing->filters($request);
        $matching = $listing->query($filters, home: true);
        $progressRecords = $userId ? DB::table('reading_progresses')
            ->where('user_id', $userId)
            ->orderBy('created_at')
            ->get() : collect();
        $progressBooks = Book::with('author')
            ->whereIn('id', $progressRecords->pluck('book_id'))
            ->get()
            ->keyBy('id');

        return Inertia::render('home', [
            'readingRules' => fn () => ReadingRule::displayList()->get(),
            'books' => fn () => $listing->cards(clone $matching)
                ->leftJoinSub(
                    DB::table('book_ratings')->selectRaw('book_id, avg(rating) as average')->groupBy('book_id'),
                    'ranking', 'ranking.book_id', '=', 'books.id'
                )
                ->orderByRaw('coalesce(ranking.average, 0) desc')
                ->orderBy('books.id')->limit(3)->get()->map($listing->card(...)),
            'bookCount' => fn () => $matching->count(),
            'filters' => $filters,
            'genres' => fn () => $listing->genres(),
            'readingProgress' => $progressRecords
                ->map(function ($progress) use ($progressBooks) {
                    $book = $progressBooks->get($progress->book_id);

                    if (! $book) {
                        return null;
                    }

                    return [
                        'id' => $progress->id,
                        'current_page' => $progress->current_page,
                        'book' => [
                            'id' => $book->id,
                            'title' => $book->title,
                            'page_count' => $book->page_count,
                            'cover_url' => $book->cover_url
                                ? (str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/'.$book->cover_url))
                                : null,
                            'author' => $book->author?->name,
                        ],
                    ];
                })
                ->filter()
                ->values(),
        ]);
    }

    public function readingProgressBooks(Request $request, BookListing $listing)
    {
        $books = $listing->query($listing->filters($request))
            ->whereNotIn('books.id', DB::table('reading_progresses')
                ->where('user_id', $request->user()->id)->select('book_id'))
            ->with('author:id,name')->orderBy('id')->simplePaginate(20, [
                'id', 'title', 'page_count', 'cover_url', 'fk_author_id',
            ]);

        return response()->json([
            'books' => $books->getCollection()->map(fn (Book $book) => [
                'id' => $book->id,
                'title' => $book->title,
                'page_count' => $book->page_count,
                'cover_url' => $listing->coverUrl($book),
                'author' => $book->author?->name,
            ]),
            'hasMore' => $books->hasMorePages(),
        ]);
    }

    public function addReadingProgress(Request $request)
    {
        $validated = $request->validate(['book_id' => ['required', 'integer', 'exists:books,id']]);
        $userId = $request->user()->id;

        if (DB::table('reading_progresses')->where('user_id', $userId)->where('book_id', $validated['book_id'])->exists()) {
            return back();
        }

        if (DB::table('reading_progresses')->where('user_id', $userId)->count() >= 5) {
            throw ValidationException::withMessages(['book_id' => 'Você já possui o limite de 5 livros em progresso.']);
        }

        DB::table('reading_progresses')->insert([
            'user_id' => $userId,
            'book_id' => $validated['book_id'],
            'current_page' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back();
    }

    public function updateReadingProgress(Request $request, int $progressId)
    {
        $progress = DB::table('reading_progresses')->where('id', $progressId)->where('user_id', $request->user()->id)->first();
        abort_unless($progress, 404);
        $book = Book::findOrFail($progress->book_id);
        $validated = $request->validate(['current_page' => ['required', 'integer', 'min:0', 'max:'.max(0, $book->page_count ?? 0)]]);

        DB::table('reading_progresses')->where('id', $progress->id)->update([
            'current_page' => $validated['current_page'],
            'updated_at' => now(),
        ]);

        return back();
    }

    public function syncReadingProgress(Request $request)
    {
        $validated = $request->validate([
            'progresses' => ['required', 'array', 'max:5'],
            'progresses.*.id' => ['required', 'integer'],
            'progresses.*.current_page' => ['required', 'integer', 'min:0'],
        ]);

        $progresses = DB::table('reading_progresses')
            ->where('user_id', $request->user()->id)
            ->whereIn('id', collect($validated['progresses'])->pluck('id'))
            ->get()
            ->keyBy('id');
        $books = Book::whereIn('id', $progresses->pluck('book_id'))->get()->keyBy('id');

        DB::transaction(function () use ($validated, $progresses, $books) {
            foreach ($validated['progresses'] as $payload) {
                $progress = $progresses->get($payload['id']);

                if (! $progress) {
                    continue;
                }

                $maxPage = max(0, $books->get($progress->book_id)?->page_count ?? 0);
                $currentPage = min($payload['current_page'], $maxPage);

                DB::table('reading_progresses')->where('id', $progress->id)->update([
                    'current_page' => $currentPage,
                    'updated_at' => now(),
                ]);
            }
        });

        return back();
    }

    public function removeReadingProgress(Request $request, int $progressId)
    {
        DB::table('reading_progresses')
            ->where('id', $progressId)
            ->where('user_id', $request->user()->id)
            ->delete();

        return back();
    }

    public function list()
    {
        $books = Book::with(['author', 'genre', 'availability'])->latest()->get();

        return view('user/dashboard', compact('books'));
    }
}
