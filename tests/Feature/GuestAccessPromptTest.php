<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GuestAccessPromptTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_gets_a_prompt_instead_of_private_content_or_a_login_redirect(): void
    {
        $this->withoutVite();
        foreach (['/social', '/estante', '/profile', '/admin/reports', '/books/99999'] as $url) {
            $this->get($url)->assertOk()->assertInertia(fn (Assert $page) => $page
                ->component('auth/required')->missing('posts')->missing('reports'));
        }
        $this->get('/social', ['X-Inertia' => 'true'])->assertOk()
            ->assertJsonPath('component', 'auth/required');
    }

    public function test_json_requests_and_writes_still_require_authentication(): void
    {
        $this->getJson('/notificacoes')->assertUnauthorized();
        $this->postJson('/chat/send', ['user_id' => 1, 'content' => 'Teste'])->assertUnauthorized();
        $this->assertDatabaseCount('messages', 0);
    }

    public function test_public_pages_expose_protected_paths_and_authenticated_users_keep_access(): void
    {
        $this->withoutVite()->get('/dashboard')->assertInertia(fn (Assert $page) => $page
            ->component('home')->where('auth.user', null)
            ->where('loginRequiredPaths', fn ($paths) => collect($paths)->contains('social') && ! collect($paths)->contains('login')));
        $this->actingAs(User::factory()->create())->get('/social')->assertOk()->assertInertia(fn (Assert $page) => $page->component('social'));
    }
}
