<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen()
    {
        $user = User::factory()->create(['email' => 'leitor@aluno.cps.sp.gov.br']);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = User::factory()->create(['email' => 'leitor@aluno.cps.sp.gov.br']);

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_admin_login_redirects_to_the_inertia_dashboard(): void
    {
        $admin = User::factory()->create(['email' => 'admin@aluno.cps.sp.gov.br', 'is_admin' => true, 'first_login' => false]);

        $this->withHeader('X-Inertia', 'true')->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertRedirect(route('admin.dashboard'))->assertHeaderMissing('X-Inertia-Location');

        $this->assertAuthenticatedAs($admin);
    }

    public function test_admin_can_login_with_a_non_institutional_email(): void
    {
        $admin = User::factory()->create(['email' => 'admin@gmail.com', 'is_admin' => true, 'first_login' => false]);

        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($admin);
    }

    public function test_users_can_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_existing_accounts_outside_the_institutional_domain_cannot_login(): void
    {
        $user = User::factory()->create(['email' => 'leitor@gmail.com']);

        $this->from('/login')->post('/login', ['email' => $user->email, 'password' => 'password', 'is_admin' => true])
            ->assertRedirect('/login')->assertSessionHasErrors('email');

        $this->assertGuest();
    }
}
