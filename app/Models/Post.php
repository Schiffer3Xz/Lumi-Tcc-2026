<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'fk_user_id',
        'fk_book_id',
        'content',
        'media_url',
    ];

    protected function casts(): array
    {
        return [
            'is_library_notice' => 'boolean',
            'notice_images' => 'array',
            'notice_removed_at' => 'datetime',
            'notice_expires_at' => 'datetime',
        ];
    }

    public function scopeSocial(Builder $query): Builder
    {
        return $query->where('is_library_notice', false);
    }

    public function scopeLibraryNotices(Builder $query): Builder
    {
        return $query->where('is_library_notice', true);
    }

    public function scopeActiveLibraryNotices(Builder $query): Builder
    {
        return $query->libraryNotices()->whereNull('notice_removed_at')
            ->where(fn (Builder $notice) => $notice->whereNull('notice_expires_at')->orWhere('notice_expires_at', '>', now()));
    }

    public function resolveRouteBindingQuery($query, $value, $field = null)
    {
        return parent::resolveRouteBindingQuery($query, $value, $field)->social();
    }

    public function noticeBooks(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'library_notice_books')->orderBy('books.id');
    }

    public function noticeReaders(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'library_notice_reads')->withPivot('read_at');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'fk_user_id');
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'fk_book_id');
    }

    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'post_likes')->withTimestamps();
    }

    public function saves(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'post_saves')->withTimestamps();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(PostComment::class)->orderBy('id');
    }
}
