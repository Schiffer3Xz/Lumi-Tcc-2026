<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Services\BookListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index()
    {
        $authors = Author::orderBy('name')->get();
        $genres = Genre::orderBy('name')->get();
        $availabilities = Availability::all();

        return Inertia::render('admin/books/create', compact(
            'authors',
            'genres',
            'availabilities',
        ));
    }

    public function updateView(Request $request, BookListing $listing)
    {
        return $this->listedBooks($request, $listing, statusView: true);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'page_count' => 'required|integer|min:1',
            'publication_year' => 'nullable|integer|min:1|max:9999',

            'fk_author_id' => 'required|exists:authors,id',
            'fk_genre_id' => 'required|exists:genres,id',
            'fk_availability_id' => 'required|exists:availabilities,id',

            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
        }

        Book::create([
            'title' => $request->title,
            'page_count' => $request->page_count,
            'publication_year' => $request->input('publication_year'),
            'fk_author_id' => $request->fk_author_id,
            'fk_genre_id' => $request->fk_genre_id,
            'fk_availability_id' => $request->fk_availability_id,
            'description' => $request->description,
            'cover_url' => $path,
        ]);

        return redirect()->route('admin.books.create')->with('success', 'Livro cadastrado com sucesso!');
    }

    public function list(Request $request, BookListing $listing)
    {
        return $this->listedBooks($request, $listing, statusView: false);
    }

    private function listedBooks(Request $request, BookListing $listing, bool $statusView)
    {
        $status = $request->query('status');
        $filters = [
            'q' => $listing->filters($request)['q'],
            'status' => is_string($status) ? mb_substr(trim($status), 0, 255) : '',
        ];
        $query = $listing->query(['q' => $filters['q'], 'genre' => ''], admin: true)
            ->select(['id', 'title', 'cover_url', 'fk_author_id', 'fk_availability_id'])
            ->with(['author:id,name', 'availability:id,availability']);
        if (! $statusView) {
            $query->addSelect('fk_genre_id')->with('genre:id,name');
        }
        if ($filters['status'] !== '') {
            $query->whereHas('availability', fn ($availability) => $availability->where('availability', $filters['status']));
        }
        $books = $query->latest()->orderByDesc('id')->paginate(BookListing::PAGE_SIZE);
        if ($books->currentPage() > $books->lastPage()) {
            return to_route($statusView ? 'admin.books.create' : 'admin.books.list', [
                ...array_filter($filters, fn ($value) => $value !== ''),
                'page' => $books->lastPage(),
            ]);
        }

        return Inertia::render($statusView ? 'admin/books/availability' : 'admin/books/index', [
            'books' => $books->getCollection()->map(fn (Book $book) => [
                'id' => $book->id,
                'title' => $book->title,
                'cover_url' => $book->cover_url,
                'author' => $book->author,
                'availability' => $book->availability,
                ...($statusView ? [] : ['genre' => $book->genre]),
            ]),
            'filters' => $filters,
            'pagination' => $listing->pagination($books),
            'statuses' => fn () => Availability::query()->where('availability', '!=', '')
                ->orderBy('availability')->distinct()->pluck('availability'),
        ]);
    }

    public function edit(Request $request, $id)
    {
        $book = Book::withReaderCount()->findOrFail($id);
        $authors = Author::orderBy('name')->get();
        $genres = Genre::orderBy('name')->get();
        $availabilities = Availability::all();

        return Inertia::render('admin/books/edit', [
            ...compact('authors', 'genres', 'availabilities', 'book'),
            'listQuery' => $this->listQuery($request),
        ]);
    }

    public function editAvailability(Request $request, Book $book)
    {
        $book->load(['author:id,name', 'availability:id,availability']);
        $availabilities = Availability::orderBy('availability')->get(['id', 'availability']);

        return Inertia::render('admin/books/edit-availability', [
            ...compact('book', 'availabilities'),
            'listQuery' => $this->listQuery($request),
        ]);
    }

    public function updateAvailability(Request $request, Book $book)
    {
        $book->update($request->validate([
            'fk_availability_id' => 'required|integer|exists:availabilities,id',
        ]));

        return to_route('admin.books.create', $this->listQuery($request))->with('success', 'Status do livro atualizado.');
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:150',
            'page_count' => 'required|integer|min:1',
            'publication_year' => 'nullable|integer|min:1|max:9999',
            'fk_author_id' => 'required|exists:authors,id',
            'fk_genre_id' => 'required|exists:genres,id',
            'fk_availability_id' => 'required|exists:availabilities,id',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $path = $book->cover_url;
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
        }

        $book->fill([
            'title' => $request->title,
            'page_count' => $request->page_count,
            'publication_year' => $request->input('publication_year'),
            'fk_author_id' => $request->fk_author_id,
            'fk_genre_id' => $request->fk_genre_id,
            'fk_availability_id' => $request->fk_availability_id,
            'description' => $request->description,
            'cover_url' => $path,
        ]);

        if ((int) $book->page_count !== (int) $book->getOriginal('page_count')) {
            $book->page_count_estimated = false;
        }
        $book->save();

        return to_route('admin.books.list', $this->listQuery($request))->with('success', 'Livro atualizado com sucesso!');
    }

    public function destroy(Request $request, $id)
    {
        Book::where('id', $id)->delete();

        return to_route('admin.books.list', $this->listQuery($request))->with('success', 'Livro deletado com sucesso!');
    }

    private function listQuery(Request $request): array
    {
        return array_filter(
            array_intersect_key($request->query(), array_flip(['q', 'status', 'page'])),
            fn ($value) => is_string($value) && $value !== '',
        );
    }
}
