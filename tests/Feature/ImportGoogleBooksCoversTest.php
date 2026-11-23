<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ImportGoogleBooksCoversTest extends TestCase
{
    use RefreshDatabase;

    public function test_import_requires_a_matching_title_and_preserves_existing_covers(): void
    {
        config(['services.google_books.key' => 'test']);
        $attributes = [
            'page_count' => 100,
            'fk_author_id' => Author::create(['name' => 'Machado de Assis'])->id,
            'fk_genre_id' => Genre::create(['name' => 'Romance'])->id,
            'fk_availability_id' => Availability::create(['availability' => 'Disponível'])->id,
        ];
        $existing = Book::create([...$attributes, 'title' => 'Helena', 'cover_url' => 'covers/helena.jpg']);
        $book = Book::create([...$attributes, 'title' => 'Dom Casmurro']);
        Http::fake(['www.googleapis.com/*' => Http::response(['items' => [
            ['volumeInfo' => ['title' => 'Outro livro', 'authors' => ['Machado de Assis'], 'imageLinks' => ['thumbnail' => 'https://books.google.com/wrong']]],
            ['volumeInfo' => ['title' => 'Dom Casmurro', 'authors' => ['Machado de Assis'], 'language' => 'pt', 'imageLinks' => ['thumbnail' => 'http://books.google.com/cover']]],
        ]])]);

        $this->artisan('books:import-covers')->assertSuccessful();

        $this->assertSame('https://books.google.com/cover', $book->fresh()->cover_url);
        $this->assertSame('covers/helena.jpg', $existing->fresh()->cover_url);
        Http::assertSentCount(1);
    }
}
