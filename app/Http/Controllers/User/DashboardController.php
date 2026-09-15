<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function index(){
        $userId = request()->user()->id;
        $progressRecords = DB::table('reading_progresses')
            ->where('user_id', $userId)
            ->orderBy('created_at')
            ->get();
        $progressBooks = Book::with('author')
            ->whereIn('id', $progressRecords->pluck('book_id'))
            ->get()
            ->keyBy('id');

         return Inertia::render('home', [
            'books' => Book::with([
                'author',
                'genre',
                'availability'
            ])->withAvg('ratings', 'rating')->get()->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'description' => $book->description,
                    'page_count' => $book->page_count,
                    'publication_year' => $book->publication_year,
                    'publisher' => $book->publisher,
                    'rating' => (float) ($book->ratings_avg_rating ?? 0),
                    'readers_count' => $book->readers_count ?? 0,
                    'cover_url' => $book->cover_url
                        ? asset('storage/' . $book->cover_url)
                        : null,
                    'author' => $book->author,
                    'genre' => $book->genre,
                    'availability' => $book->availability,
                ];
            }),
            'genres' => Genre::query()
                ->orderBy('name')
                ->get()
                ->map(fn ($genre) => [
                    'label' => $genre->name,
                    'icon' => 'fa-solid fa-bookmark',
                ]),
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
                                ? (str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/' . $book->cover_url))
                                : null,
                            'author' => $book->author?->name,
                        ],
                    ];
                })
                ->filter()
                ->values(),
        ]);
    }

    public function addReadingProgress(Request $request)
    {
        $validated = $request->validate(['book_id' => ['required', 'integer', 'exists:books,id']]);
        $userId = $request->user()->id;

        if (DB::table('reading_progresses')->where('user_id', $userId)->where('book_id', $validated['book_id'])->exists()) {
            return back();
        }

        if (DB::table('reading_progresses')->where('user_id', $userId)->count() >= 3) {
            throw ValidationException::withMessages(['book_id' => 'Você já possui o limite de 3 livros em progresso.']);
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
        $validated = $request->validate(['current_page' => ['required', 'integer', 'min:0', 'max:' . max(0, $book->page_count ?? 0)]]);

        DB::table('reading_progresses')->where('id', $progress->id)->update([
            'current_page' => $validated['current_page'],
            'updated_at' => now(),
        ]);

        return back();
    }

    public function syncReadingProgress(Request $request)
    {
        $validated = $request->validate([
            'progresses' => ['required', 'array', 'max:3'],
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

    
    public function list(){
        $books = Book::with(['author', 'genre', 'availability'])->latest()->get();
        return view('user/dashboard', compact('books'));
    }
}
