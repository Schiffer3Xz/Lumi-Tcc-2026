<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostComment;
use App\Services\ReaderNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostInteractionController extends Controller
{
    public function like(Request $request, Post $post)
    {
        return $this->setInteraction($request, $post, 'post_likes');
    }

    public function save(Request $request, Post $post)
    {
        return $this->setInteraction($request, $post, 'post_saves');
    }

    private function setInteraction(Request $request, Post $post, string $table)
    {
        $key = ['post_id' => $post->id, 'user_id' => $request->user()->id];

        if ($request->isMethod('delete')) {
            DB::table($table)->where($key)->delete();
        } else {
            $inserted = DB::table($table)->insertOrIgnore($key + ['created_at' => now(), 'updated_at' => now()]);
            if ($inserted && $table === 'post_likes') {
                ReaderNotificationService::send($post->fk_user_id, $request->user()->id, 'like', $post->id);
            }
        }

        return back();
    }

    public function comment(Request $request, Post $post)
    {
        $validated = $request->validate(['content' => ['required', 'string', 'max:2000']]);
        $post->comments()->create($validated + ['user_id' => $request->user()->id]);
        ReaderNotificationService::send($post->fk_user_id, $request->user()->id, 'comment', $post->id);

        return back();
    }

    public function deleteComment(Request $request, Post $post, PostComment $comment)
    {
        abort_unless($comment->post_id === $post->id, 404);
        abort_unless($comment->user_id === $request->user()->id || $post->fk_user_id === $request->user()->id, 403);
        $comment->delete();

        return back();
    }
}
