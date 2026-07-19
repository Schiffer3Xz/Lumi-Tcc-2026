<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Book extends Model
{
    protected $fillable = [
        'title',
        'page_count',
        'fk_author_id',
        'fk_genre_id',
        'fk_availability_id',
        'description',
        'cover_url',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class, 'fk_author_id');
    }

    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class, 'fk_genre_id');
    }

    public function availability(): BelongsTo
    {
        return $this->belongsTo(Availability::class, 'fk_availability_id');
    }
}
