<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostInteractionsTest extends TestCase
{
    use RefreshDatabase;

    private function publication(User $author): Post
    {
        return Post::create(['fk_user_id' => $author->id, 'content' => 'Uma boa leitura']);
    }

    public function test_likes_persist_are_idempotent_and_belong_to_each_viewer(): void
    {
        $author = User::factory()->create();
        $viewer = User::factory()->create();
        $post = $this->publication($author);

        $this->actingAs($viewer)->from('/social')->put("/post/{$post->id}/like")->assertRedirect('/social');
        $this->put("/post/{$post->id}/like")->assertRedirect();
        $this->actingAs($author)->put("/post/{$post->id}/like")->assertRedirect();
        $this->assertDatabaseCount('post_likes', 2);

        $this->withoutVite()->get('/social')->assertInertia(fn (Assert $page) => $page
            ->where('posts.0.likesCount', 2)->where('posts.0.isLiked', true));
        $this->delete("/post/{$post->id}/like")->assertRedirect();
        $this->delete("/post/{$post->id}/like")->assertRedirect();
        $this->assertDatabaseCount('post_likes', 1);
        $this->get('/social')->assertInertia(fn (Assert $page) => $page
            ->where('posts.0.likesCount', 1)->where('posts.0.isLiked', false));
    }

    public function test_saved_posts_are_persistent_private_and_can_be_removed(): void
    {
        $author = User::factory()->create();
        $viewer = User::factory()->create();
        $post = $this->publication($author);
        $this->publication($author);

        $this->actingAs($viewer)->put("/post/{$post->id}/save")->assertRedirect();
        $this->put("/post/{$post->id}/save")->assertRedirect();
        $this->assertDatabaseCount('post_saves', 1);
        $this->withoutVite()->get('/social?saved=1')->assertInertia(fn (Assert $page) => $page
            ->has('posts', 1)->where('posts.0.id', $post->id)->where('posts.0.isSaved', true));
        $this->actingAs($author)->get('/social?saved=1')->assertInertia(fn (Assert $page) => $page->has('posts', 0));
        $this->actingAs($viewer)->delete("/post/{$post->id}/save")->assertRedirect();
        $this->get('/social?saved=1')->assertInertia(fn (Assert $page) => $page->has('posts', 0));
    }

    public function test_comment_uses_authenticated_author_and_is_returned_in_feed(): void
    {
        $author = User::factory()->create();
        $viewer = User::factory()->create(['name' => 'Leitora']);
        $post = $this->publication($author);

        $this->actingAs($viewer)->from('/social')->post("/post/{$post->id}/comments", [
            'content' => 'Também gostei!', 'user_id' => $author->id,
        ])->assertRedirect('/social');
        $this->assertDatabaseHas('post_comments', ['post_id' => $post->id, 'user_id' => $viewer->id, 'content' => 'Também gostei!']);
        $this->withoutVite()->get('/social')->assertInertia(fn (Assert $page) => $page
            ->where('posts.0.commentsCount', 1)
            ->where('posts.0.comments.0.user', 'Leitora')
            ->where('posts.0.comments.0.text', 'Também gostei!')
            ->where('posts.0.comments.0.canDelete', true));
        $this->get('/profile')->assertInertia(fn (Assert $page) => $page->has('posts', 0));
        $this->actingAs($author)->get('/profile')->assertInertia(fn (Assert $page) => $page->where('posts.0.comments', 1));
    }

    public function test_empty_and_oversized_comments_are_rejected(): void
    {
        $user = User::factory()->create();
        $post = $this->publication($user);
        foreach (['', '   ', str_repeat('a', 2001)] as $content) {
            $this->actingAs($user)->post("/post/{$post->id}/comments", ['content' => $content])->assertSessionHasErrors('content');
        }
        $this->assertDatabaseCount('post_comments', 0);
    }

    public function test_only_comment_or_post_author_can_remove_comment_and_post_must_match(): void
    {
        $author = User::factory()->create();
        $commenter = User::factory()->create();
        $stranger = User::factory()->create();
        $post = $this->publication($author);
        $otherPost = $this->publication($author);
        $comment = $post->comments()->create(['user_id' => $commenter->id, 'content' => 'Comentário']);

        $this->actingAs($stranger)->delete("/post/{$post->id}/comments/{$comment->id}")->assertForbidden();
        $this->actingAs($author)->delete("/post/{$otherPost->id}/comments/{$comment->id}")->assertNotFound();
        $this->actingAs($commenter)->delete("/post/{$post->id}/comments/{$comment->id}")->assertRedirect();
        $comment = $post->comments()->create(['user_id' => $commenter->id, 'content' => 'Outro']);
        $this->actingAs($author)->delete("/post/{$post->id}/comments/{$comment->id}")->assertRedirect();
        $this->assertDatabaseCount('post_comments', 0);
    }

    public function test_only_post_author_can_edit_or_delete_and_deletion_cleans_interactions(): void
    {
        $author = User::factory()->create();
        $stranger = User::factory()->create();
        $post = $this->publication($author);
        $this->actingAs($stranger)->patch("/post/{$post->id}", ['content' => 'Alterado'])->assertForbidden();
        $this->delete("/post/{$post->id}")->assertForbidden();
        $this->put("/post/{$post->id}/like");
        $this->put("/post/{$post->id}/save");
        $this->post("/post/{$post->id}/comments", ['content' => 'Comentário']);
        $this->actingAs($author)->patch("/post/{$post->id}", ['content' => 'Atualizado'])->assertRedirect();
        $this->assertDatabaseHas('posts', ['id' => $post->id, 'content' => 'Atualizado']);
        $this->from('/social?post='.$post->id)->delete("/post/{$post->id}")->assertRedirect('/social');
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        foreach (['post_likes', 'post_saves', 'post_comments'] as $table) {
            $this->assertDatabaseCount($table, 0);
        }
    }

    public function test_text_posts_cannot_be_emptied_but_image_captions_can(): void
    {
        $author = User::factory()->create();
        $post = $this->publication($author);
        $this->actingAs($author)->patch("/post/{$post->id}", ['content' => ' '])->assertSessionHasErrors('content');
        $this->patch("/post/{$post->id}", ['content' => str_repeat('a', 5001)])->assertSessionHasErrors('content');
        $post->update(['media_url' => 'posts/photo.jpg']);
        $this->patch("/post/{$post->id}", ['content' => ''])->assertRedirect();
        $this->assertDatabaseHas('posts', ['id' => $post->id, 'content' => '', 'media_url' => 'posts/photo.jpg']);
    }

    public function test_shared_link_opens_the_correct_post_and_missing_post_returns_404(): void
    {
        $author = User::factory()->create();
        $post = $this->publication($author);
        $this->publication($author);
        $this->withoutVite()->actingAs($author)->get('/social?post='.$post->id)->assertInertia(fn (Assert $page) => $page
            ->has('posts', 1)->where('posts.0.id', $post->id)
            ->where('posts.0.url', route('list', ['post' => $post->id]))
            ->where('posts.0.canManage', true));
        $this->get('/social?post=99999')->assertNotFound();
        $this->get('/social?post=invalid')->assertSessionHasErrors('post');
    }

    public function test_interactions_require_authentication_and_an_existing_post(): void
    {
        $user = User::factory()->create();
        $post = $this->publication($user);
        foreach (['like', 'save'] as $action) {
            $this->put("/post/{$post->id}/{$action}")->assertRedirect('/login');
            $this->delete("/post/{$post->id}/{$action}")->assertRedirect('/login');
        }
        $this->post("/post/{$post->id}/comments", ['content' => 'Olá'])->assertRedirect('/login');
        $this->patch("/post/{$post->id}", ['content' => 'Olá'])->assertRedirect('/login');
        $this->delete("/post/{$post->id}")->assertRedirect('/login');
        $this->delete("/post/{$post->id}/comments/1")->assertRedirect('/login');
        $this->actingAs($user)->put('/post/99999/like')->assertNotFound();
        $this->put('/post/99999/save')->assertNotFound();
        $this->post('/post/99999/comments', ['content' => 'Olá'])->assertNotFound();
    }
}
