<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
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

    public function updateView()
    {
        $books = Book::with(['author', 'genre', 'availability'])->latest()->get();

        return Inertia::render('admin/books/availability', compact('books'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'page_count' => 'required|integer|min:1',

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
            'fk_author_id' => $request->fk_author_id,
            'fk_genre_id' => $request->fk_genre_id,
            'fk_availability_id' => $request->fk_availability_id,
            'description' => $request->description,
            'cover_url' => $path,
        ]);

        return redirect()->route('admin.books.create')->with('success', 'Livro cadastrado com sucesso!');
    }

    public function list()
    {
        $books = Book::with(['author', 'genre', 'availability'])->latest()->get();

        return Inertia::render('admin/books/index', compact('books'));
    }

    public function edit($id)
    {
        $book = Book::findOrFail($id);
        $authors = Author::orderBy('name')->get();
        $genres = Genre::orderBy('name')->get();
        $availabilities = Availability::all();

        return Inertia::render('admin/books/edit', compact('authors', 'genres', 'availabilities', 'book'));
    }

    public function toggleAvailability(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $request->validate([

        ]);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:150',
            'page_count' => 'required|integer|min:1',
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

        $book->update([
            'title' => $request->title,
            'page_count' => $request->page_count,
            'fk_author_id' => $request->fk_author_id,
            'fk_genre_id' => $request->fk_genre_id,
            'fk_availability_id' => $request->fk_availability_id,
            'description' => $request->description,
            'cover_url' => $path,
        ]);

        return redirect()->route('admin.books.list')->with('success', 'Livro atualizado com sucesso!');
    }

    public function destroy($id)
    {
        Book::where('id', $id)->delete();

        return redirect()->route('admin.books.list')->with('success', 'Livro deletado com sucesso!');
    }
}
