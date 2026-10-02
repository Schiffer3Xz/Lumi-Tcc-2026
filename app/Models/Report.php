<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    public const STATUSES = ['pending', 'reviewed', 'dismissed'];

    protected $fillable = [
        'content',
        'fk_user_id',
        'fk_post_id',
        'fk_comment_id',
        'status',
        'review_note',
        'reviewed_by',
        'reviewed_at',
        'target_snapshot',
    ];

    protected function casts(): array
    {
        return ['reviewed_at' => 'datetime', 'target_snapshot' => 'array', 'moderation_result' => 'array', 'moderated_at' => 'datetime'];
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'fk_post_id');
    }

    public function comment(): BelongsTo
    {
        return $this->belongsTo(PostComment::class, 'fk_comment_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
