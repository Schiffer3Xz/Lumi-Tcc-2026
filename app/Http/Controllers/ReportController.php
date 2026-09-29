<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($request, $post, $validated) {
            // Serialize submissions for this post to avoid duplicate pending reports.
            $post = Post::with('user')->lockForUpdate()->findOrFail($post->id);
            $exists = Report::where('fk_user_id', $request->user()->id)
                ->where('fk_post_id', $post->id)->whereNull('fk_comment_id')
                ->where('status', 'pending')->exists();

            if (! $exists) {
                Report::create([
                    'content' => $validated['content'],
                    'fk_user_id' => $request->user()->id,
                    'fk_post_id' => $post->id,
                    'status' => 'pending',
                    'target_snapshot' => [
                        'type' => 'post', 'content' => $post->content,
                        'author' => $post->user?->name, 'image' => $post->media_url,
                    ],
                ]);
            }
        });

        return back()->with('success', 'Sua denúncia está na fila de análise.');
    }
}
