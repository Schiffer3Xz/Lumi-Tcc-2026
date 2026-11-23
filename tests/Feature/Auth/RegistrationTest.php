<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register()
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'teste@aluno.cps.sp.gov.br',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_registration_requires_the_exact_institutional_domain(): void
    {
        foreach (['gmail.com', 'outlook.com', 'hotmail.com', 'aluno.cps.sp.gov.br.example.com', 'outro.aluno.cps.sp.gov.br'] as $domain) {
            $email = 'teste@'.$domain;
            $this->from('/register')->post('/register', [
                'name' => 'Test User',
                'email' => $email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ])->assertRedirect('/register')->assertSessionHasErrors('email');
            $this->assertDatabaseMissing('users', ['email' => $email]);
        }

        $this->assertGuest();
    }
}
