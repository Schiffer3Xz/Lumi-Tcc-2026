<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_report_uses_authenticated_user_and_route_post(): void
    {
        $author = User::factory()->create();
        $reporter = User::factory()->create();
        $post = Post::create(['fk_user_id' => $author->id, 'content' => 'Publicação']);

        $this->actingAs($reporter)->from('/social')->post(route('posts.report', $post), [
            'content' => str_repeat('a', 100),
            'fk_user_id' => $author->id,
            'fk_post_id' => 99999,
            'fk_comment_id' => 99999,
        ])->assertRedirect('/social')->assertSessionHas('success');

        $this->assertDatabaseHas('reports', [
            'content' => str_repeat('a', 100),
            'fk_user_id' => $reporter->id,
            'fk_post_id' => $post->id,
            'fk_comment_id' => null,
        ]);
        $this->assertDatabaseCount('reports', 1);
        $this->assertDatabaseCount('post_saves', 0);
    }

    public function test_invalid_report_content_is_rejected(): void
    {
        $user = User::factory()->create();
        $post = Post::create(['fk_user_id' => $user->id, 'content' => 'Publicação']);

        foreach ([null, '', '   ', str_repeat('a', 101), ['invalid']] as $content) {
            $this->actingAs($user)->post(route('posts.report', $post), [
                'content' => $content,
            ])->assertSessionHasErrors('content');
        }

        $this->assertDatabaseCount('reports', 0);
    }

    public function test_guests_cannot_report_and_missing_posts_return_not_found(): void
    {
        $user = User::factory()->create();
        $post = Post::create(['fk_user_id' => $user->id, 'content' => 'Publicação']);

        $this->post(route('posts.report', $post), ['content' => 'Spam'])
            ->assertRedirect(route('login'));
        $this->actingAs($user)->post(route('posts.report', 99999), ['content' => 'Spam'])
            ->assertNotFound();

        $this->assertDatabaseCount('reports', 0);
    }
}
