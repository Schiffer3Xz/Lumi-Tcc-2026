<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'page_count',
        'publication_year',
        'publisher',
        'rating',
        'readers_count',
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

    public function scopeWithReaderCount(Builder $query): Builder
    {
        if ($query->getQuery()->columns === null) {
            $query->select('books.*');
        }

        return $query->selectSub(
            DB::table('reading_progresses')->selectRaw('COUNT(DISTINCT user_id)')
                ->whereColumn('reading_progresses.book_id', 'books.id'),
            'readers_count',
        );
    }

    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class, 'fk_genre_id');
    }

    public function availability(): BelongsTo
    {
        return $this->belongsTo(Availability::class, 'fk_availability_id');
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(BookRating::class);
    }
}
