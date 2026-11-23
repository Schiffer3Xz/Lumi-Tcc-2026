<?php

namespace App\Services;

use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class LibraryNotices
{
    public static function listing(): Builder
    {
        return Post::libraryNotices()->with(['user:id,name,nickname,profile_photo', 'noticeBooks.author:id,name'])
            ->latest()->orderByDesc('id');
    }

    public static function canManage(Post $notice, User $user): bool
    {
        return $user->is_admin && (
            (int) $notice->fk_user_id === (int) $user->id ||
            in_array((string) $user->id, array_map('strval', config('services.library_notices.manager_ids', [])), true)
        );
    }

    public static function markRead(Post $notice, User $user): void
    {
        DB::transaction(function () use ($notice, $user) {
            $now = now();
            DB::table('library_notice_reads')->insertOrIgnore([
                'post_id' => $notice->id, 'user_id' => $user->id, 'read_at' => $now,
            ]);
            DB::table('reader_notifications')->where([
                'post_id' => $notice->id, 'user_id' => $user->id, 'kind' => ReaderNotificationService::LIBRARY_NOTICE,
            ])->whereNull('read_at')->update(['read_at' => $now, 'updated_at' => $now]);
        });
    }

    public static function data(Post $notice, User $user): array
    {
        return [
            'id' => $notice->id,
            'content' => $notice->content,
            'images' => array_map(fn ($path) => asset('storage/'.$path), $notice->notice_images ?? []),
            'books' => $notice->noticeBooks->map(PostResource::bookData(...))->values(),
            'author' => [
                'id' => $notice->user->id,
                'name' => $notice->user->name,
                'username' => ltrim($notice->user->nickname ?? '', '@'),
                'profile_photo' => $notice->user->profile_photo,
            ],
            'publishedAt' => $notice->created_at?->toIso8601String(),
            'removedAt' => $notice->notice_removed_at?->toIso8601String(),
            'expiresAt' => $notice->notice_expires_at?->toIso8601String(),
            'readCount' => $notice->notice_readers_count,
            'hasRead' => (bool) $notice->has_read,
            'canManage' => ! $notice->notice_removed_at && self::canManage($notice, $user),
        ];
    }
}
