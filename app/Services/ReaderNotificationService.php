<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ReaderNotificationService
{
    public const LIBRARY_NOTICE = 'library_notice';

    public static function visibleFor(int $userId): Builder
    {
        return DB::table('reader_notifications as notifications')
            ->where('notifications.user_id', $userId)
            ->where(fn (Builder $query) => $query
                ->where('notifications.kind', '!=', self::LIBRARY_NOTICE)
                ->orWhereExists(Post::activeLibraryNotices()->whereColumn('posts.id', 'notifications.post_id')->toBase()));
    }

    public static function publishLibraryNotice(int $postId, int $actor): void
    {
        User::query()->select('id')->chunkById(250, function ($users) use ($postId, $actor) {
            $now = now();
            $ids = $users->pluck('id')->all();
            DB::table('reader_notifications')->insert(array_map(fn (int $id) => [
                'user_id' => $id,
                'actor_id' => $actor,
                'kind' => self::LIBRARY_NOTICE,
                'post_id' => $postId,
                'created_at' => $now,
                'updated_at' => $now,
            ], $ids));

            DB::afterCommit(function () use ($ids) {
                foreach ($ids as $id) {
                    rescue(fn () => event(new \App\Events\ReaderNotificationCreated($id)));
                }
            });
        });
    }

    public static function send(int $recipient, int $actor, string $kind, ?int $postId = null, ?int $conversationId = null): void
    {
        if ($recipient === $actor || ! User::whereKey($recipient)->where('social_notifications', true)->exists()) {
            return;
        }

        if ($kind === 'message' && $conversationId && Cache::has("chat-viewing:{$recipient}:{$conversationId}")) {
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
