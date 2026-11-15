<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'image' => $this->media_url ? asset('storage/'.$this->media_url) : null,
            'time' => $this->created_at?->locale('pt_BR')->diffForHumans(),
            'url' => route('list', ['post' => $this->id]),
            'canManage' => $this->fk_user_id === $request->user()->id,
            'author' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'profile_photo' => $this->user?->profile_photo,
                'username' => ltrim($this->user?->nickname ?? '', '@'),
            ],
            'book' => $this->book ? [
                'id' => $this->book->id,
                'cover_url' => $this->book->cover_url
                    ? (str_starts_with($this->book->cover_url, 'http') ? $this->book->cover_url : asset('storage/'.$this->book->cover_url))
                    : null,
                'title' => $this->book->title,
                'author' => $this->book->author?->name,
                'badge' => 'Livro mencionado',
                'coverBg' => 'bg-slate-800',
            ] : null,
            'likesCount' => $this->likes_count,
            'commentsCount' => $this->comments_count,
            'isLiked' => (bool) $this->is_liked,
            'isSaved' => (bool) $this->is_saved,
            'comments' => $this->comments->map(fn ($comment) => [
                'id' => $comment->id,
                'user' => ['name' => $comment->user?->name, 'profile_photo' => $comment->user?->profile_photo],
                'text' => $comment->content,
                'time' => $comment->created_at?->locale('pt_BR')->diffForHumans(),
                'canDelete' => $comment->user_id === $request->user()->id || $this->fk_user_id === $request->user()->id,
            ])->all(),
        ];
    }
}
