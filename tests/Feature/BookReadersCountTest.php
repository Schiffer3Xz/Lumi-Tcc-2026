<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BookReadersCountTest extends TestCase
{
    use RefreshDatabase;

    private function book(): Book
    {
        return Book::create([
            'title' => 'Leitura compartilhada', 'page_count' => 100, 'readers_count' => 999,
            'fk_author_id' => Author::create(['name' => 'Autor'])->id,
            'fk_genre_id' => Genre::create(['name' => 'Romance'])->id,
            'fk_availability_id' => Availability::create(['availability' => 'Disponível'])->id,
        ]);
    }

    public function test_unique_readers_follow_progress_addition_removal_and_account_deletion(): void
    {
        $this->withoutVite();
        $book = $this->book();
        $first = User::factory()->create();
        $second = User::factory()->create();
        $this->assertSame(0, (int) Book::withReaderCount()->findOrFail($book->id)->readers_count);
        $this->actingAs($first)->post(route('reading-progress.store'), ['book_id' => $book->id])->assertSessionHasNoErrors();
        $this->post(route('reading-progress.store'), ['book_id' => $book->id])->assertSessionHasNoErrors();
        $this->assertSame(1, (int) Book::withReaderCount()->findOrFail($book->id)->readers_count);
        $this->actingAs($second)->post(route('reading-progress.store'), ['book_id' => $book->id])->assertSessionHasNoErrors();
        $this->get(route('dashboard'))->assertInertia(fn (Assert $page) => $page->where('books.0.readers_count', 2));
        $this->get(route('catalogo'))->assertInertia(fn (Assert $page) => $page->where('books.0.readers_count', 2));
        $this->getJson(route('book.show', $book))->assertJsonPath('book.readers_count', 2);
        $this->post(route('book.favorite', $book))->assertSessionHasNoErrors();
        $this->get(route('shelf'))->assertInertia(fn (Assert $page) => $page->where('books.0.readers_count', 2));
        $progress = DB::table('reading_progresses')->where('user_id', $second->id)->first();
        $this->patch(route('reading-progress.update', $progress->id), ['current_page' => 100])->assertSessionHasNoErrors();
        $this->assertSame(2, (int) Book::withReaderCount()->findOrFail($book->id)->readers_count);
        $this->delete(route('reading-progress.destroy', $progress->id))->assertSessionHasNoErrors();
        $this->assertSame(1, (int) Book::withReaderCount()->findOrFail($book->id)->readers_count);
        $first->delete();
        $this->getJson(route('book.show', $book))->assertJsonPath('book.readers_count', 0);
    }

    public function test_invalid_publication_year_cannot_be_saved(): void
    {
        $book = $this->book();
        $this->actingAs(User::factory()->create(['is_admin' => true, 'first_login' => false]));
        foreach ([0, -1, 10000, 2026.5, 'abc'] as $year) {
            $this->post(route('admin.books.store'), [
                ...$book->only(['title', 'page_count', 'fk_author_id', 'fk_genre_id', 'fk_availability_id']),
                'publication_year' => $year,
            ])->assertSessionHasErrors('publication_year');
        }
        $this->assertDatabaseCount('books', 1);
    }

    public function test_progress_accepts_five_books_syncs_them_and_rejects_a_sixth(): void
    {
        $reader = User::factory()->create();
        $this->actingAs($reader);
        for ($i = 0; $i < 5; $i++) {
            $this->post(route('reading-progress.store'), ['book_id' => $this->book()->id])->assertSessionHasNoErrors();
        }
        $sixth = $this->book();
        $this->post(route('reading-progress.store'), ['book_id' => $sixth->id])->assertSessionHasErrors('book_id');
        $this->assertDatabaseCount('reading_progresses', 5);
        $progresses = DB::table('reading_progresses')->where('user_id', $reader->id)->get()
            ->map(fn ($progress) => ['id' => $progress->id, 'current_page' => 10])->all();
        $this->patch(route('reading-progress.sync'), ['progresses' => $progresses])->assertSessionHasNoErrors();
        $this->assertSame(5, DB::table('reading_progresses')->where('current_page', 10)->count());
        $this->delete(route('reading-progress.destroy', $progresses[0]['id']))->assertSessionHasNoErrors();
        $this->post(route('reading-progress.store'), ['book_id' => $sixth->id])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('reading_progresses', 5);
    }
}
