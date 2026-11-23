<?php

namespace App\Console\Commands;

use App\Models\Book;
use Illuminate\Console\Command;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ImportGoogleBooksCovers extends Command
{
    protected $signature = 'books:import-covers {--limit=100 : Máximo de consultas por execução} {--after=0 : Continuar após este ID de livro}';

    protected $description = 'Busca capas de edições identificadas pelo título no Google Books';

    public function handle(): int
    {
        $key = config('services.google_books.key');
        if (blank($key)) {
            $this->error('Configure GOOGLE_BOOKS_API_KEY para consultar o Google Books.');

            return self::FAILURE;
        }

        $lastId = max(0, (int) $this->option('after'));
        $limit = max(1, (int) $this->option('limit'));
        $processed = 0;
        $updated = 0;

        $books = Book::query()->where(fn ($query) => $query->whereNull('cover_url')->orWhere('cover_url', ''))
            ->where('id', '>', $lastId)->with('author:id,name')->orderBy('id')->lazyById();

        foreach ($books->take($limit) as $book) {
            try {
                $response = Http::acceptJson()->connectTimeout(5)->timeout(12)->get('https://www.googleapis.com/books/v1/volumes', [
                    'q' => $book->title,
                    'key' => $key,
                    'printType' => 'books',
                    'maxResults' => 20,
                    'fields' => 'items(volumeInfo(title,subtitle,authors,language,imageLinks))',
                ]);
            } catch (ConnectionException) {
                $this->error("Falha de conexão. Consulte novamente com --after=$lastId.");

                return self::FAILURE;
            }

            if (! $response->successful()) {
                $this->error("Google Books retornou HTTP {$response->status()}. Continue com --after=$lastId.");

                return self::FAILURE;
            }

            $cover = $this->matchingCover($book, $response->json('items', []));
            if ($cover !== null) {
                $updated += Book::whereKey($book->id)
                    ->where(fn ($query) => $query->whereNull('cover_url')->orWhere('cover_url', ''))
                    ->update(['cover_url' => $cover]);
            }

            $lastId = $book->id;
            $processed++;
        }

        $this->info("$updated capas cadastradas em $processed consultas. Último ID: $lastId.");

        return self::SUCCESS;
    }

    private function matchingCover(Book $book, array $items): ?string
    {
        $title = $this->normalize($book->title);
        $author = $this->normalize($book->author?->name ?? '');
        $author = $author === 'autor nao informado' ? '' : $author;
        if ($author === '' && ! str_contains($title, ' ')) {
            return null;
        }

        $matches = [];
        foreach ($items as $item) {
            $volume = $item['volumeInfo'] ?? [];
            $volumeTitle = $this->normalize($volume['title'] ?? '');
            $fullTitle = $this->normalize(($volume['title'] ?? '').' '.($volume['subtitle'] ?? ''));
            if ($title !== $volumeTitle && $title !== $fullTitle) {
                continue;
            }

            $authors = array_map($this->normalize(...), $volume['authors'] ?? []);
            if ($authors === [] || ($author !== '' && ! in_array($author, $authors, true))) {
                continue;
            }

            $image = $volume['imageLinks']['thumbnail'] ?? '';
            if (! in_array(parse_url($image, PHP_URL_HOST), ['books.google.com', 'books.googleusercontent.com'], true)) {
                continue;
            }

            sort($authors);
            $matches[] = [
                'authors' => implode('|', $authors),
                'portuguese' => ($volume['language'] ?? '') === 'pt',
                'url' => preg_replace('/^http:/i', 'https:', $image),
            ];
        }

        if (count(array_unique(array_column($matches, 'authors'))) !== 1) {
            return null;
        }

        foreach ($matches as $match) {
            if ($match['portuguese']) {
                return $match['url'];
            }
        }

        return $matches[0]['url'];
    }

    private function normalize(string $value): string
    {
        return trim(preg_replace('/[^a-z0-9]+/', ' ', Str::lower(Str::ascii($value))));
    }
}
