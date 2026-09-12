<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;

class PostController extends Controller
{

    public function index()
    {
        return Inertia::render('newPost');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:5120'],
        ]);

        if (blank($validated['content'] ?? null) && !$request->hasFile('image')) {
            return back()->withErrors(['content' => 'Escreva algo ou adicione uma imagem.']);
        }

        $post = new Post([
            'fk_user_id' => $request->user()->id,
            'content' => $validated['content'] ?? '',
        ]);

        if ($request->hasFile('image')) {
            $post->media_url = $request->file('image')->store('posts', 'public');
        }

        $post->save();

        return redirect()->route('list')->with('success', 'Publicação criada com sucesso.');
    }
}
