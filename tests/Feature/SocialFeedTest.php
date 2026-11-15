<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Models\Post;
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
        $this->withoutVite()->get('/social')->assertInertia(fn (Assert $page) => $page->component('auth/required'));
    }

    public function test_followed_authors_come_first_with_newest_posts_first_in_each_group(): void
    {
        $viewer = User::factory()->create();
        $followed = User::factory()->create();
        $other = User::factory()->create();
        $viewer->follows()->attach($followed->id);
        $followedOld = Post::create(['fk_user_id' => $followed->id, 'content' => 'Seguido antigo', 'created_at' => now()->subDays(4)]);
        $followedNew = Post::create(['fk_user_id' => $followed->id, 'content' => 'Seguido recente', 'created_at' => now()->subDays(2)]);
        $otherOld = Post::create(['fk_user_id' => $other->id, 'content' => 'Outro antigo', 'created_at' => now()->subDay()]);
        $otherNew = Post::create(['fk_user_id' => $other->id, 'content' => 'Outro recente']);
        $this->withoutVite()->actingAs($viewer)->get(route('list'))->assertInertia(fn (Assert $page) => $page
            ->has('posts', 4)->where('posts.0.id', $followedNew->id)->where('posts.1.id', $followedOld->id)
            ->where('posts.2.id', $otherNew->id)->where('posts.3.id', $otherOld->id));

        // Following is personal: another viewer still gets chronological order.
        $this->actingAs($other)->get(route('list'))->assertInertia(fn (Assert $page) => $page
            ->where('posts.0.id', $otherNew->id)->where('posts.1.id', $otherOld->id)
            ->where('posts.2.id', $followedNew->id)->where('posts.3.id', $followedOld->id));

        // Unfollowing removes the priority on the next feed request.
        $viewer->follows()->detach($followed->id);
        $this->actingAs($viewer)->get(route('list'))->assertInertia(fn (Assert $page) => $page
            ->where('posts.0.id', $otherNew->id)->where('posts.1.id', $otherOld->id));
    }

    public function test_priority_preserves_saved_posts_order_and_shared_post_selection(): void
    {
        $viewer = User::factory()->create();
        $followed = User::factory()->create();
        $viewer->follows()->attach($followed->id);
        $older = Post::create(['fk_user_id' => $followed->id, 'content' => 'Seguido', 'created_at' => now()->subDay()]);
        $newer = Post::create(['fk_user_id' => $viewer->id, 'content' => 'Meu post']);
        $older->saves()->attach($viewer->id);
        $newer->saves()->attach($viewer->id);
        $this->withoutVite()->actingAs($viewer)->get(route('list', ['saved' => 1]))->assertInertia(fn (Assert $page) => $page
            ->has('posts', 2)->where('posts.0.id', $newer->id)->where('posts.1.id', $older->id));
        $this->get(route('list', ['post' => $newer->id]))->assertInertia(fn (Assert $page) => $page
            ->has('posts', 1)->where('posts.0.id', $newer->id));
    }
}
