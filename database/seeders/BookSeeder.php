<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookSeeder extends Seeder
{
    private const GENERIC_ABNT_COVER = 'https://tccguia.com.br/wp-content/uploads/2022/11/modelo-de-Capa-ABNT.png';

    public function run(): void
    {
        $catalog = new \SplFileObject(__DIR__.'/assets/books/acervo-lumi.jsonl');
        $catalog->setFlags(\SplFileObject::DROP_NEW_LINE | \SplFileObject::SKIP_EMPTY | \SplFileObject::READ_AHEAD);

        DB::transaction(function () use ($catalog) {
            $unclassifiedId = Genre::where('name', 'Não classificado')->value('id');
            $now = now();
            $books = [];
            $authorIds = [];
            $genreIds = [];
            $availabilityIds = [];

            foreach ($catalog as $line) {
                $item = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
                $author = $item['author'];
                $genre = $item['genre'];
                $availability = $item['availability'];
                $authorIds[$author] ??= Author::firstOrCreate(['name' => $author])->id;
                $genreIds[$genre] ??= Genre::firstOrCreate(['name' => $genre])->id;
                $availabilityIds[$availability] ??= Availability::firstOrCreate(['availability' => $availability])->id;

                $books[] = [
                    'accession_number' => $item['accession_number'],
                    'title' => $item['title'],
                    'page_count' => $item['page_count'],
                    'page_count_estimated' => $item['page_count_estimated'],
                    'publication_year' => $item['publication_year'],
                    'publisher' => $item['publisher'],
                    'fk_author_id' => $authorIds[$author],
                    'fk_genre_id' => $genreIds[$genre],
                    'fk_availability_id' => $availabilityIds[$availability],
                    'description' => $item['description'],
                    'cover_url' => $item['cover_url'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            foreach (array_chunk($books, 100) as $batch) {
                // Match by the inventory number so rerunning the seed preserves edits and status changes.
                Book::query()->toBase()->upsert($batch, ['accession_number'], ['accession_number']);

                $existing = Book::query()->whereIn('accession_number', array_column($batch, 'accession_number'))
                    ->get(['id', 'accession_number', 'fk_genre_id', 'page_count', 'cover_url'])->keyBy('accession_number');

                foreach ($batch as $item) {
                    $book = $existing->get($item['accession_number']);
                    if ($unclassifiedId !== null && (int) $book->fk_genre_id === (int) $unclassifiedId) {
                        $book->fk_genre_id = $item['fk_genre_id'];
                    }
                    if ((int) $book->page_count === 0) {
                        $book->page_count = $item['page_count'];
                        $book->page_count_estimated = $item['page_count_estimated'];
                    }
                    if ($book->cover_url === self::GENERIC_ABNT_COVER || (blank($book->cover_url) && filled($item['cover_url']))) {
                        $book->cover_url = $item['cover_url'];
                    }
                    if ($book->isDirty()) {
                        $book->save();
                    }
                }
            }
        });
    }
}
