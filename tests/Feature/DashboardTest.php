<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\BookRating;
use App\Models\Genre;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_visit_dashboard_without_personal_data()
    {
        $this->withoutVite()->get('/dashboard')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('home')
                ->where('auth.user', null)->has('readingProgress', 0)->where('unreadNotifications', 0));
        $this->get('/catalogo')->assertOk();
    }

    public function test_guests_must_login_before_changing_reading_progress(): void
    {
        $this->post('/reading-progress', ['book_id' => 1])->assertRedirect('/login');
        $this->patch('/reading-progress/sync', ['progresses' => []])->assertRedirect('/login');
        $this->patch('/reading-progress/1', ['current_page' => 10])->assertRedirect('/login');
        $this->delete('/reading-progress/1')->assertRedirect('/login');
        $this->assertDatabaseCount('reading_progresses', 0);
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->actingAs($user = User::factory()->create());

        $this->get('/dashboard')->assertOk();
    }

    public function test_authenticated_users_can_visit_the_catalog_and_see_books()
    {
        $this->actingAs(User::factory()->create());

        $author = Author::create(['name' => 'J. R. R. Tolkien']);
        $genre = Genre::create(['name' => 'Fantasia']);
        $availability = Availability::create(['availability' => 'Disponível']);

        Book::create([
            'title' => 'O Hobbit',
            'page_count' => 310,
            'description' => 'Uma aventura épica.',
            'cover_url' => null,
            'fk_author_id' => $author->id,
            'fk_genre_id' => $genre->id,
            'fk_availability_id' => $availability->id,
        ]);

        $this->get('/catalogo')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('catalogo')
                ->where('books.0.title', 'O Hobbit')
            );
    }

    public function test_book_listings_limit_results_and_search_the_whole_catalog(): void
    {
        $reader = User::factory()->create();
        $author = Author::create(['name' => 'Autor']);
        $genre = Genre::create(['name' => 'Ficção']);
        $availability = Availability::create(['availability' => 'Disponível']);

        foreach (range(1, 22) as $number) {
            $book = Book::create([
                'title' => $number === 22 ? 'ÚLTIMO LIVRO' : "Livro $number",
                'page_count' => 100,
                'fk_author_id' => $author->id,
                'fk_genre_id' => $genre->id,
                'fk_availability_id' => $availability->id,
            ]);
        }

        BookRating::create(['user_id' => $reader->id, 'book_id' => $book->id, 'rating' => 5]);

        $this->withoutVite()->get(route('dashboard'))->assertInertia(fn (Assert $page) => $page
            ->has('books', 3)->where('books.0.id', $book->id)->where('bookCount', 22));
        $this->get(route('catalogo'))->assertInertia(fn (Assert $page) => $page
            ->has('books', 20)->where('pagination.total', 22)->where('pagination.totalPages', 2));
        $this->get(route('catalogo', ['page' => 2]))->assertInertia(fn (Assert $page) => $page
            ->has('books', 2)->where('books.1.id', $book->id)->where('pagination.first', 21));
        $this->get(route('catalogo', ['q' => 'último', 'genre' => 'ficção']))->assertInertia(fn (Assert $page) => $page
            ->has('books', 1)->where('books.0.id', $book->id)->where('catalogTotal', 22));
        $this->get(route('catalogo', ['q' => '%']))->assertInertia(fn (Assert $page) => $page->has('books', 0));

        $this->actingAs($reader)->getJson(route('reading-progress.books', ['page' => 2]))
            ->assertOk()->assertJsonCount(2, 'books')->assertJsonPath('books.1.id', $book->id);
        DB::table('reading_progresses')->insert(['user_id' => $reader->id, 'book_id' => $book->id]);
        $this->getJson(route('reading-progress.books', ['q' => 'último']))
            ->assertOk()->assertExactJson(['books' => [], 'hasMore' => false]);
    }
}
