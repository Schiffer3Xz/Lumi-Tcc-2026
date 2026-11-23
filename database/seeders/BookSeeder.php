<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    private const GENERIC_ABNT_COVER = 'https://tccguia.com.br/wp-content/uploads/2022/11/modelo-de-Capa-ABNT.png';

    public function run(): void
    {
        $catalog = new \SplFileObject(__DIR__.'/assets/books/acervo-etec-joao-belarmino.jsonl');
        $catalog->setFlags(\SplFileObject::DROP_NEW_LINE | \SplFileObject::SKIP_EMPTY | \SplFileObject::READ_AHEAD);
        $covers = json_decode(file_get_contents(__DIR__.'/assets/books/acervo-capas.json'), true, 512, JSON_THROW_ON_ERROR);
        $selected = array_fill_keys(json_decode(
            file_get_contents(__DIR__.'/assets/books/acervo-selecionado.json'),
            true,
            512,
            JSON_THROW_ON_ERROR,
        ), true);

        DB::transaction(function () use ($catalog, $covers, $selected) {
            $author = Author::firstOrCreate(['name' => 'Autor não informado']);
            $unclassifiedId = Genre::where('name', 'Não classificado')->value('id');
            $availability = Availability::firstOrCreate(['availability' => 'A confirmar']);
            $now = now();
            $books = [];
            $titles = [];
            $genreIds = [];

            foreach ($catalog as $line) {
                $item = json_decode($line, true, 512, JSON_THROW_ON_ERROR);
                $title = isset($item['subtitle']) ? $item['title'].' — '.$item['subtitle'] : $item['title'];
                $titleKey = Str::lower(Str::squish($title));
                if (isset($titles[$titleKey])) {
                    continue;
                }
                $titles[$titleKey] = true;

                if (! isset($selected[$item['number']])) {
                    continue;
                }

                [$genre, $pages] = AcervoBookMetadata::estimate($title, $item['cdd'] ?? '');
                $genreIds[$genre] ??= Genre::firstOrCreate(['name' => $genre])->id;
                $details = ['Número no acervo: '.$item['number']];
                foreach (['cdd' => 'CDD', 'cutter' => 'Cutter', 'acquired' => 'Aquisição', 'volume' => 'Volume'] as $field => $label) {
                    if (isset($item[$field])) {
                        $details[] = $label.': '.$item[$field];
                    }
                }

                $books[] = [
                    'accession_number' => $item['number'],
                    'title' => $title,
                    'page_count' => $pages,
                    'page_count_estimated' => true,
                    'fk_author_id' => $author->id,
                    'fk_genre_id' => $genreIds[$genre],
                    'fk_availability_id' => $availability->id,
                    'description' => implode("\n", $details),
                    'cover_url' => $covers[$item['number']],
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
                        $book->page_count_estimated = true;
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
