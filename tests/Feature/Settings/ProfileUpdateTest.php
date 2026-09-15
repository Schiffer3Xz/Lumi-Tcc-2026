<?php

namespace Tests\Feature\Settings;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_inertia_does_not_expose_password_or_remember_token(): void
    {
        $user = User::factory()->create();
        $this->withoutVite()->actingAs($user)->get('/settings/profile')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.id', $user->id)
                ->missing('auth.user.password')->missing('auth.user.remember_token'));
    }

    public function test_user_with_posts_and_interactions_can_delete_their_account(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $post = Post::create(['fk_user_id' => $user->id, 'content' => 'Meu post']);
        $post->likes()->attach($other->id);
        $post->comments()->create(['user_id' => $other->id, 'content' => 'Comentário']);
        $otherPost = Post::create(['fk_user_id' => $other->id, 'content' => 'Outro post']);

        $this->actingAs($user)->delete('/settings/profile', ['password' => 'password'])->assertRedirect('/');

        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        $this->assertDatabaseCount('post_likes', 0);
        $this->assertDatabaseCount('post_comments', 0);
        $this->assertDatabaseHas('posts', ['id' => $otherPost->id]);
    }

    public function test_profile_page_is_displayed()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/settings/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/settings/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/settings/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/settings/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/settings/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/settings/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/settings/profile')
            ->delete('/settings/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/settings/profile');

        $this->assertNotNull($user->fresh());
    }
}
