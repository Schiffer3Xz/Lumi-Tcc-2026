<?php

namespace App\Services;

use App\Models\Book;
use App\Models\Genre;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookListing
{
    public const PAGE_SIZE = 20;

    public function pagination(LengthAwarePaginator $books): array
    {
        return [
            'currentPage' => $books->currentPage(),
            'totalPages' => $books->lastPage(),
            'first' => $books->firstItem() ?? 0,
            'last' => $books->lastItem() ?? 0,
            'total' => $books->total(),
        ];
    }

    public function filters(Request $request): array
    {
        $query = $request->query('q');
        $genre = $request->query('genre');

        return [
            'q' => is_string($query) ? mb_substr(trim($query), 0, 150) : '',
            'genre' => is_string($genre) ? mb_substr(trim($genre), 0, 255) : '',
        ];
    }

    public function query(array $filters, bool $home = false, bool $admin = false): Builder
    {
        $books = Book::query();
        if ($filters['q'] === '' && $filters['genre'] === '') {
            return $books;
        }

        $lower = 'lower';
        $driver = DB::connection()->getDriverName();
        $normalize = $admin ? fn (string $text) => mb_strtolower(Str::ascii($text)) : mb_strtolower(...);
        if ($driver === 'sqlite') {
            $lower = $admin ? 'lumi_fold' : 'lumi_lower';
            DB::connection()->getPdo()->sqliteCreateFunction($lower, $normalize, 1);
        }

        if ($filters['genre'] !== '') {
            $books->whereHas('genre', function (Builder $genre) use ($filters, $home, $lower) {
                if ($home) {
                    $genre->whereRaw("$lower(name) = ?", [mb_strtolower($filters['genre'])]);
                } else {
                    $genre->whereRaw("$lower(name) LIKE ? ESCAPE '!'", [$this->pattern($filters['genre'])]);
                }
            });
        }

        if ($filters['q'] !== '') {
            $pattern = $this->pattern($admin ? $normalize($filters['q']) : $filters['q']);
            $books->where(function (Builder $matches) use ($pattern, $home, $admin, $lower, $driver) {
                $matchName = fn (Builder $query) => $query->whereRaw("$lower(name) LIKE ? ESCAPE '!'", [$pattern]);
                $matches->whereRaw("$lower(title) LIKE ? ESCAPE '!'", [$pattern])->orWhereHas('author', $matchName);
                if ($admin && str_contains($pattern, ' ')) {
                    $titleAndAuthor = $driver === 'sqlite' ? "books.title || ' ' || authors.name" : "concat(books.title, ' ', authors.name)";
                    $matches->orWhereHas('author', fn (Builder $author) => $author
                        ->whereRaw("$lower($titleAndAuthor) LIKE ? ESCAPE '!'", [$pattern]));
                }
                if ($home) {
                    $matches->orWhereHas('genre', $matchName);
                }
            });
        }

        return $books;
    }

    public function cards(Builder $books): Builder
    {
        return $books->with(['author:id,name', 'genre:id,name', 'availability:id,availability'])
            ->withReaderCount()->withAvg('ratings', 'rating');
    }

    public function card(Book $book): array
    {
        return [
            'id' => $book->id,
            'title' => $book->title,
            'page_count' => $book->page_count,
            'page_count_estimated' => $book->page_count_estimated,
            'publication_year' => $book->publication_year,
            'publisher' => $book->publisher,
            'readers_count' => $book->readers_count,
            'rating' => (float) ($book->ratings_avg_rating ?? 0),
            'cover_url' => $this->coverUrl($book),
            'author' => $book->author,
            'genre' => $book->genre,
            'availability' => $book->availability,
        ];
    }

    public function coverUrl(Book $book): ?string
    {
        if (! $book->cover_url) {
            return null;
        }

        return str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/'.$book->cover_url);
    }

    public function genres(): Collection
    {
        return Genre::orderBy('name')->pluck('name')->map(fn ($name) => [
            'label' => $name,
            'icon' => 'fa-solid fa-bookmark',
        ]);
    }

    private function pattern(string $value): string
    {
        return '%'.strtr(mb_strtolower($value), ['!' => '!!', '%' => '!%', '_' => '!_']).'%';
    }
}
