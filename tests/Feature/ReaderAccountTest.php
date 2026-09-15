<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\BookRating;
use App\Models\Genre;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReaderAccountTest extends TestCase
{
    use RefreshDatabase;

    private function book(): Book
    {
        return Book::create([
            'title' => 'Livro do histórico', 'page_count' => 100,
            'fk_author_id' => Author::create(['name' => 'Autor'])->id,
            'fk_genre_id' => Genre::create(['name' => 'Romance'])->id,
            'fk_availability_id' => Availability::create(['availability' => 'Disponível'])->id,
        ]);
    }

    public function test_quick_access_pages_require_login_and_render_for_readers(): void
    {
        foreach (['/historico', '/regras', '/privacidade', '/notificacoes'] as $url) {
            $this->get($url)->assertRedirect('/login');
        }
        $this->patch('/privacidade')->assertRedirect('/login');
        $this->post('/notificacoes/lidas')->assertRedirect('/login');
        $this->post('/notificacoes/1/abrir')->assertRedirect('/login');
        $this->withoutVite()->actingAs(User::factory()->create());
        foreach (['/historico' => 'readingHistory', '/regras' => 'readingRules', '/privacidade' => 'privacy', '/notificacoes' => 'notifications'] as $url => $component) {
            $this->get($url)->assertOk()->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_history_contains_only_the_current_users_records_in_date_order(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $book = $this->book();
        foreach ([$user, $other] as $reader) {
            DB::table('reading_progresses')->insert(['user_id' => $reader->id, 'book_id' => $book->id, 'current_page' => 100, 'created_at' => now()->subDays(3), 'updated_at' => now()->subDays(2)]);
            DB::table('book_favorites')->insert(['user_id' => $reader->id, 'book_id' => $book->id, 'created_at' => now()->subDays(3), 'updated_at' => now()->subDays(3)]);
            BookRating::create(['user_id' => $reader->id, 'book_id' => $book->id, 'rating' => 5]);
        }
        $this->withoutVite()->actingAs($user)->get('/historico')->assertInertia(fn (Assert $page) => $page
            ->has('entries', 3)->where('entries.0.kind', 'rating')->where('entries.0.rating', 5)
            ->where('entries.1.kind', 'reading')->where('entries.1.currentPage', 100)
            ->where('entries.2.kind', 'saved')->where('entries.0.url', route('book.show', $book->id)));
        $this->actingAs(User::factory()->create())->get('/historico')->assertInertia(fn (Assert $page) => $page->has('entries', 0));
    }

    public function test_privacy_is_saved_for_current_user_and_controls_review_visibility(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $book = $this->book();
        BookRating::create(['user_id' => $user->id, 'book_id' => $book->id, 'rating' => 5, 'comment' => 'Comentário privado']);
        $this->actingAs($user)->from('/privacidade')->patch('/privacidade', ['public_reviews' => false, 'social_notifications' => false, 'user_id' => $other->id])->assertRedirect('/privacidade');
        $this->assertFalse($user->fresh()->public_reviews);
        $this->assertTrue($other->fresh()->public_reviews);
        $this->withoutVite()->get('/privacidade')->assertInertia(fn (Assert $page) => $page->where('auth.user.public_reviews', false));
        $this->get('/books/'.$book->id)->assertInertia(fn (Assert $page) => $page->has('comments', 1));
        $this->actingAs($other)->get('/books/'.$book->id)->assertInertia(fn (Assert $page) => $page->has('comments', 0)->where('book.rating', 5));
        $this->actingAs($user)->patch('/privacidade', ['public_reviews' => true, 'social_notifications' => true]);
        $this->actingAs($other)->get('/books/'.$book->id)->assertInertia(fn (Assert $page) => $page->has('comments', 1));
    }

    public function test_invalid_preferences_are_rejected_without_changing_settings(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->patch('/privacidade', ['public_reviews' => 'invalid'])->assertSessionHasErrors(['public_reviews', 'social_notifications']);
        $this->assertTrue($user->fresh()->public_reviews);
        $this->assertTrue($user->fresh()->social_notifications);
    }

    public function test_shelf_picker_offers_unsaved_books_and_adds_without_leaving_shelf(): void
    {
        $book = $this->book();
        $reader = User::factory()->create();
        $this->withoutVite()->actingAs($reader)->get('/estante')->assertInertia(fn (Assert $page) => $page
            ->has('books', 0)->has('availableBooks', 1)->where('availableBooks.0.id', $book->id));
        $this->from('/estante')->put('/books/'.$book->id.'/favorite')->assertRedirect('/estante');
        $this->get('/estante')->assertInertia(fn (Assert $page) => $page
            ->has('books', 1)->where('books.0.id', $book->id)->has('availableBooks', 0));
        $this->actingAs(User::factory()->create())->get('/estante')->assertInertia(fn (Assert $page) => $page
            ->has('books', 0)->has('availableBooks', 1));
    }

    public function test_catalog_favorites_and_shelf_actions_persist_without_duplicates_and_are_private(): void
    {
        $book = $this->book();
        $reader = User::factory()->create();
        $other = User::factory()->create();
        $this->put('/books/'.$book->id.'/favorite')->assertRedirect('/login');
        $this->delete('/books/'.$book->id.'/favorite')->assertRedirect('/login');
        $this->withoutVite()->actingAs($reader)->get('/catalogo')->assertInertia(fn (Assert $page) => $page->where('books.0.is_favorite', false));
        $this->from('/catalogo')->put('/books/'.$book->id.'/favorite')->assertRedirect('/catalogo');
        $this->put('/books/'.$book->id.'/favorite')->assertRedirect('/catalogo');
        $this->assertDatabaseCount('book_favorites', 1);
        $this->get('/catalogo')->assertInertia(fn (Assert $page) => $page->where('books.0.is_favorite', true));
        $this->get('/estante')->assertInertia(fn (Assert $page) => $page->has('books', 1)->where('books.0.id', $book->id));
        $this->actingAs($other)->get('/catalogo')->assertInertia(fn (Assert $page) => $page->where('books.0.is_favorite', false));
        $this->delete('/books/'.$book->id.'/favorite');
        $this->assertDatabaseCount('book_favorites', 1);
        $this->actingAs($reader)->delete('/books/'.$book->id.'/favorite')->assertRedirect();
        $this->delete('/books/'.$book->id.'/favorite')->assertRedirect();
        $this->get('/estante')->assertInertia(fn (Assert $page) => $page->has('books', 0));
        $this->get('/catalogo')->assertInertia(fn (Assert $page) => $page->where('books.0.is_favorite', false));
        $this->put('/books/999999/favorite')->assertNotFound();
    }

    public function test_book_popup_loads_details_and_refreshes_actions_without_leaving_catalog(): void
    {
        $book = $this->book();
        $reader = User::factory()->create();
        $privateReviewer = User::factory()->create(['public_reviews' => false]);
        BookRating::create(['user_id' => $privateReviewer->id, 'book_id' => $book->id, 'rating' => 3, 'comment' => 'Privado']);
        $this->getJson('/books/'.$book->id)->assertUnauthorized();
        $this->actingAs($reader)->getJson('/books/'.$book->id)->assertOk()
            ->assertJsonPath('book.id', $book->id)->assertJsonPath('book.is_favorite', false)
            ->assertJsonCount(0, 'comments')->assertJsonStructure(['book', 'comments', 'similarBooks']);
        $this->from('/catalogo')->post('/books/'.$book->id.'/favorite')->assertRedirect('/catalogo');
        $this->post('/books/'.$book->id.'/rating', ['rating' => 5, 'comment' => 'Excelente'])->assertRedirect('/catalogo');
        $response = $this->getJson('/books/'.$book->id)->assertOk()
            ->assertJsonPath('book.is_favorite', true)->assertJsonPath('book.user_rating', 5)
            ->assertJsonPath('comments.0.comment', 'Excelente')->assertJsonPath('comments.0.can_delete', true)
            ->assertJsonCount(1, 'comments');
        $this->delete('/books/'.$book->id.'/comments/'.$response->json('comments.0.id'))->assertRedirect('/catalogo');
        $this->getJson('/books/'.$book->id)->assertJsonCount(0, 'comments');
        $this->getJson('/books/999999')->assertNotFound();
    }

    public function test_real_interactions_create_notifications_without_duplicate_likes_or_self_alerts(): void
    {
        $author = User::factory()->create();
        $actor = User::factory()->create();
        $post = Post::create(['fk_user_id' => $author->id, 'content' => 'Publicação']);
        $this->actingAs($actor)->put('/post/'.$post->id.'/like');
        $this->put('/post/'.$post->id.'/like');
        $this->post('/post/'.$post->id.'/comments', ['content' => 'Gostei']);
        $this->post('/people/'.$author->id.'/follow');
        $this->post('/people/'.$author->id.'/follow');
        $this->actingAs($author)->put('/post/'.$post->id.'/like');
        $this->assertDatabaseCount('reader_notifications', 3);
        $this->withoutVite()->get('/notificacoes')->assertInertia(fn (Assert $page) => $page
            ->has('notifications.data', 3)->where('unreadNotifications', 3)->where('notifications.data.0.kind', 'follow'));
        $this->actingAs($actor)->get('/notificacoes')->assertInertia(fn (Assert $page) => $page->has('notifications.data', 0)->where('unreadNotifications', 0));
    }

    public function test_disabled_notifications_do_not_generate_new_alerts(): void
    {
        $author = User::factory()->create(['social_notifications' => false]);
        $actor = User::factory()->create();
        $post = Post::create(['fk_user_id' => $author->id, 'content' => 'Publicação']);
        $this->actingAs($actor)->put('/post/'.$post->id.'/like');
        $this->post('/post/'.$post->id.'/comments', ['content' => 'Gostei']);
        $this->post('/people/'.$author->id.'/follow');
        $this->assertDatabaseCount('reader_notifications', 0);
    }

    public function test_notification_popup_returns_paginated_json_for_current_user_only(): void
    {
        $this->getJson('/notificacoes')->assertUnauthorized();
        $recipient = User::factory()->create();
        $actor = User::factory()->create();
        foreach (range(1, 21) as $index) {
            DB::table('reader_notifications')->insert([
                'user_id' => $recipient->id, 'actor_id' => $actor->id, 'kind' => 'follow',
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        $this->actingAs($recipient)->getJson('/notificacoes')->assertOk()
            ->assertJsonCount(20, 'notifications.data')
            ->assertJsonPath('notifications.last_page', 2)
            ->assertJsonPath('notifications.data.0.actor', $actor->name)
            ->assertJsonMissingPath('notifications.data.0.email');
        $this->getJson('/notificacoes?page=2')->assertOk()->assertJsonCount(1, 'notifications.data');
        $this->from('/dashboard')->post('/notificacoes/lidas')->assertRedirect('/dashboard');
        $this->assertNotNull($this->getJson('/notificacoes')->json('notifications.data.0.read_at'));
        $this->actingAs($actor)->getJson('/notificacoes')->assertOk()->assertJsonCount(0, 'notifications.data');
    }

    public function test_open_and_mark_read_are_scoped_to_the_recipient(): void
    {
        $author = User::factory()->create();
        $actor = User::factory()->create();
        $post = Post::create(['fk_user_id' => $author->id, 'content' => 'Publicação']);
        $this->actingAs($actor)->put('/post/'.$post->id.'/like');
        $likeId = DB::table('reader_notifications')->value('id');
        $this->post('/notificacoes/'.$likeId.'/abrir')->assertNotFound();
        $this->post('/notificacoes/lidas');
        $this->assertDatabaseHas('reader_notifications', ['id' => $likeId, 'read_at' => null]);
        $this->actingAs($author)->post('/notificacoes/'.$likeId.'/abrir')->assertRedirect(route('list', ['post' => $post->id]));
        $this->assertNotNull(DB::table('reader_notifications')->where('id', $likeId)->value('read_at'));
        $this->actingAs($actor)->post('/people/'.$author->id.'/follow');
        $followId = DB::table('reader_notifications')->where('kind', 'follow')->value('id');
        $this->actingAs($author)->post('/notificacoes/'.$followId.'/abrir')->assertRedirect(route('people', $actor->id));
        $this->actingAs($actor)->post('/post/'.$post->id.'/comments', ['content' => 'Novo']);
        $this->actingAs($author)->post('/notificacoes/lidas');
        $this->assertSame(0, DB::table('reader_notifications')->whereNull('read_at')->count());
        $this->delete('/post/'.$post->id);
        $this->assertDatabaseMissing('reader_notifications', ['post_id' => $post->id]);
    }
}
