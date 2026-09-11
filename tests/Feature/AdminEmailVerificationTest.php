<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

class AdminEmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    private function credentials(): array
    {
        return [
            'name' => 'Administrador', 'nickname' => 'admin-teste', 'email' => '',
            'current_password' => 'password', 'password' => 'nova-senha-segura',
            'password_confirmation' => 'nova-senha-segura',
        ];
    }

    public function test_first_access_saves_and_sends_verification_for_current_email(): void
    {
        Notification::fake();
        $admin = User::factory()->unverified()->create(['is_admin' => true, 'first_login' => true]);
        $this->actingAs($admin)->post(route('admin.credentials.update'), $this->credentials())
            ->assertRedirect(route('verification.notice'))->assertSessionHas('status', 'verification-link-sent');

        Notification::assertSentTo($admin, VerifyEmail::class);
        $this->assertFalse((bool) $admin->fresh()->first_login);
        $this->assertFalse($admin->fresh()->hasVerifiedEmail());
        $this->assertTrue(Hash::check('nova-senha-segura', $admin->fresh()->password));
        $this->get(route('admin.dashboard'))->assertRedirect(route('verification.notice'));
    }

    public function test_smtp_failure_keeps_saved_profile_and_shows_recovery_page(): void
    {
        Notification::shouldReceive('send')->once()->andThrow(new TransportException('SMTP unavailable'));
        $admin = User::factory()->unverified()->create(['is_admin' => true, 'first_login' => true]);
        $this->withoutVite()->actingAs($admin)->post(route('admin.credentials.update'), $this->credentials())
            ->assertRedirect(route('verification.notice'))->assertSessionHasErrors('verification')
            ->assertSessionMissing('status');

        $this->assertFalse((bool) $admin->fresh()->first_login);
        $this->assertTrue(Hash::check('nova-senha-segura', $admin->fresh()->password));
        $this->get(route('verification.notice'))->assertOk()
            ->assertSee('Não foi possível enviar')->assertSee(route('verification.send'));
    }

    public function test_resend_reports_success_and_transport_errors(): void
    {
        $admin = User::factory()->unverified()->create(['is_admin' => true, 'first_login' => false]);
        Notification::fake();
        $this->actingAs($admin)->from(route('verification.notice'))->post(route('verification.send'))
            ->assertRedirect(route('verification.notice'))->assertSessionHas('status', 'verification-link-sent');
        Notification::assertSentTo($admin, VerifyEmail::class);

        Notification::shouldReceive('send')->once()->andThrow(new TransportException('SMTP unavailable'));
        $this->from(route('verification.notice'))->post(route('verification.send'))
            ->assertRedirect(route('verification.notice'))->assertSessionHasErrors('verification');
    }

    public function test_invalid_password_does_not_save_or_send_email(): void
    {
        Notification::fake();
        $admin = User::factory()->unverified()->create(['is_admin' => true, 'first_login' => true]);
        $data = array_replace($this->credentials(), [
            'current_password' => 'wrong', 'password' => 'short', 'password_confirmation' => 'different',
        ]);
        $this->actingAs($admin)->from(route('admin.first-login'))->post(route('admin.credentials.update'), $data)
            ->assertRedirect(route('admin.first-login'))->assertSessionHasErrors(['current_password', 'password']);
        $this->assertTrue((bool) $admin->fresh()->first_login);
        $this->assertTrue(Hash::check('password', $admin->fresh()->password));
        Notification::assertNothingSent();
    }

    public function test_signed_link_verifies_admin_and_opens_dashboard(): void
    {
        $admin = User::factory()->unverified()->create(['is_admin' => true, 'first_login' => false]);
        $link = URL::temporarySignedRoute('verification.verify', now()->addMinutes(60), [
            'id' => $admin->id, 'hash' => sha1($admin->email),
        ]);
        $this->actingAs($admin)->get($link)->assertRedirect(route('admin.dashboard', absolute: false).'?verified=1');
        $this->assertTrue($admin->fresh()->hasVerifiedEmail());
        $this->withoutVite()->get(route('admin.dashboard'))->assertOk();
    }
}
