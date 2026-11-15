<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Book;
use App\Services\Moderation\PublicationModeration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('newPost', [
            'books' => Book::with('author:id,name')->orderBy('title')->get(['id', 'title', 'cover_url', 'fk_author_id'])
                ->map(fn (Book $book) => [
                    'id' => $book->id, 'title' => $book->title,
                    'author' => $book->author?->name,
                    'cover_url' => $book->cover_url
                        ? (str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/'.$book->cover_url))
                        : null,
                ]),
        ]);
    }

    public function store(Request $request, PublicationModeration $moderation)
    {
        $validated = $request->validate([
            'content' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'book_id' => ['nullable', 'integer', 'exists:books,id'],
        ]);

        if (blank($validated['content'] ?? null) && ! $request->hasFile('image') && empty($validated['book_id'])) {
            return back()->withErrors(['content' => 'Escreva algo, adicione uma imagem ou selecione um livro.']);
        }

        $moderation->validate($validated['content'] ?? null);

        if ($request->hasFile('image')) {
            $moderation->validateImage($request->file('image'));
        }

        $post = new Post([
            'fk_user_id' => $request->user()->id,
            'content' => $validated['content'] ?? '',
            'fk_book_id' => $validated['book_id'] ?? null,
        ]);

        if ($request->hasFile('image')) {
            $post->media_url = $request->file('image')->store('posts', 'public');
        }

        $post->save();

        return redirect()->route('list')->with('success', 'Publicação criada com sucesso.');
    }

    public function update(Request $request, Post $post, PublicationModeration $moderation)
    {
        abort_unless($post->fk_user_id === $request->user()->id, 403);
        $validated = $request->validate([
            'content' => [$post->media_url || $post->fk_book_id ? 'nullable' : 'required', 'string', 'max:5000'],
        ]);
        $moderation->validate($validated['content'] ?? null);
        $post->update(['content' => $validated['content'] ?? '']);

        return back();
    }
}
