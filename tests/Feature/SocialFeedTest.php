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

class SocialFeedTest extends TestCase
{
    use RefreshDatabase;

    public function test_social_feed_returns_stored_posts_in_newest_first_order(): void
    {
        $viewer = User::factory()->create();
        $writer = User::factory()->create(['name' => 'Leitora', 'nickname' => '@leitora']);
        $book = Book::create([
            'title' => 'Livro de teste',
            'page_count' => 100,
            'fk_author_id' => Author::create(['name' => 'Autor de teste'])->id,
            'fk_genre_id' => Genre::create(['name' => 'Romance'])->id,
            'fk_availability_id' => Availability::create(['availability' => 'Disponível'])->id,
        ]);

        foreach (['Primeira publicação', 'Segunda publicação'] as $index => $content) {
            DB::table('posts')->insert([
                'fk_user_id' => $writer->id,
                'fk_book_id' => $book->id,
                'content' => $content,
                'created_at' => now()->subMinutes(2 - $index),
                'updated_at' => now(),
            ]);
        }

        $this->withoutVite()->actingAs($viewer)->get('/social')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('social')
                ->has('posts', 2)
                ->where('posts.0.content', 'Segunda publicação')
                ->where('posts.1.content', 'Primeira publicação')
                ->where('posts.0.author.name', 'Leitora')
                ->where('posts.0.author.username', 'leitora')
                ->missing('posts.0.author.email')
                ->where('posts.0.book.title', 'Livro de teste')
                ->where('posts.0.book.author', 'Autor de teste')
                ->where('posts.0.likesCount', 0)
                ->where('posts.0.comments', [])
            );
    }

    public function test_social_feed_returns_an_empty_list_when_there_are_no_posts(): void
    {
        $this->withoutVite()->actingAs(User::factory()->create())->get('/social')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('social')->has('posts', 0));
    }

    public function test_guests_cannot_access_the_social_feed(): void
    {
        $this->get('/social')->assertRedirect('/login');
    }
}
