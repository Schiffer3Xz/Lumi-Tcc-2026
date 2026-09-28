<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|max:100',
        ]);

        Report::create([
            'content' => $validated['content'],
            'fk_user_id' => $request->user()->id,
            'fk_post_id' => $post->id,
        ]);

        return back()->with('success', 'Denúncia enviada com sucesso.');
    }
}
