<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostBookReferenceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        config(['services.openai.moderation_enabled' => false]);
        $this->actingAs(User::factory()->create());
    }

    private function book(): Book
    {
        return Book::create([
            'title' => 'Livro mencionado', 'page_count' => 100, 'cover_url' => 'https://example.com/cover.jpg',
            'fk_author_id' => Author::create(['name' => 'Autora de teste'])->id,
            'fk_genre_id' => Genre::create(['name' => 'Romance'])->id,
            'fk_availability_id' => Availability::create(['availability' => 'Disponível'])->id,
        ]);
    }

    public function test_composer_offers_catalog_and_reference_persists_in_feed(): void
    {
        $book = $this->book();
        $book->update(['cover_url' => 'covers/livro.jpg']);
        $coverUrl = asset('storage/covers/livro.jpg');
        $this->get(route('post'))->assertInertia(fn (Assert $page) => $page
            ->component('newPost')->where('books.0.id', $book->id)->where('books.0.author', 'Autora de teste')
            ->where('books.0.cover_url', $coverUrl));
        $this->post(route('posts.store'), ['content' => 'Gostei deste livro.', 'book_id' => $book->id])
            ->assertSessionHasNoErrors()->assertRedirect(route('list'));
        $this->assertDatabaseHas('posts', ['fk_book_id' => $book->id, 'content' => 'Gostei deste livro.', 'fk_user_id' => auth()->id()]);
        $this->get(route('list'))->assertInertia(fn (Assert $page) => $page
            ->where('posts.0.book.id', $book->id)->where('posts.0.book.title', $book->title)
            ->where('posts.0.book.author', 'Autora de teste')->where('posts.0.book.cover_url', $coverUrl));
        $this->get(route('profile'))->assertInertia(fn (Assert $page) => $page
            ->where('posts.0.book.id', $book->id)->where('posts.0.book.cover_url', $coverUrl));
    }

    public function test_reference_only_post_is_allowed_and_survives_text_edit(): void
    {
        $book = $this->book();
        $this->post(route('posts.store'), ['book_id' => $book->id])->assertSessionHasNoErrors();
        $post = Post::firstOrFail();
        $this->patch(route('posts.update', $post), ['content' => '', 'book_id' => 99999])->assertSessionHasNoErrors();
        $this->assertSame($book->id, $post->fresh()->fk_book_id);
    }

    public function test_unknown_book_is_rejected_and_reference_remains_optional(): void
    {
        $this->post(route('posts.store'), ['content' => 'Leitura', 'book_id' => 99999])->assertSessionHasErrors('book_id');
        $this->assertDatabaseCount('posts', 0);
        $this->post(route('posts.store'), ['content' => 'Leitura'])->assertSessionHasNoErrors();
        $this->assertNull(Post::firstOrFail()->fk_book_id);
    }
}
