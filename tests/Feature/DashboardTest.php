<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Book;
use App\Models\Genre;
use App\Models\User;
use App\Models\Availability;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get('/dashboard')->assertRedirect('/login');
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
}
