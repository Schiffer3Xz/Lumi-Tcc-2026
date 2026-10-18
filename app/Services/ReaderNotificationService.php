<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReaderNotificationService
{
    public static function send(int $recipient, int $actor, string $kind, ?int $postId = null, ?int $conversationId = null): void
    {
        if ($recipient === $actor || ! User::whereKey($recipient)->where('social_notifications', true)->exists()) {
            return;
        }

        // A repeated follow or like should not create repeated alerts.
        if (in_array($kind, ['like', 'follow'], true) && DB::table('reader_notifications')->where([
            'user_id' => $recipient, 'actor_id' => $actor, 'kind' => $kind, 'post_id' => $postId,
        ])->exists()) {
            return;
        }

        DB::table('reader_notifications')->insert([
            'user_id' => $recipient,
            'actor_id' => $actor,
            'kind' => $kind,
            'post_id' => $postId,
            'conversation_id' => $conversationId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        event(new \App\Events\ReaderNotificationCreated($recipient));
    }
}
