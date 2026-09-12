<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    protected $fillable = [
        'fk_user_id',
        'fk_book_id',
        'content',
        'media_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'fk_book_id');
    }
}
