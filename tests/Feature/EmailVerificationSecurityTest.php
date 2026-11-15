<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->unverified()->create(['is_admin' => true, 'first_login' => false]);
    }

    private function link(User $user, string $route, int $minutes = 60): string
    {
        return URL::temporarySignedRoute($route, now()->addMinutes($minutes), [
            'id' => $user->id, 'hash' => sha1($user->email),
        ]);
    }

    public function test_expired_tampered_and_other_account_links_cannot_verify(): void
    {
        foreach (['verification.verify', 'admin.email.verify'] as $route) {
            $admin = $this->admin();
            $other = $this->admin();
            $this->actingAs($admin)->get($this->link($admin, $route, -1))->assertForbidden();
            $this->get($this->link($admin, $route).'&tampered=1')->assertForbidden();
            $this->get($this->link($other, $route))->assertForbidden();
            $this->assertFalse($admin->fresh()->hasVerifiedEmail());
            $this->assertFalse($other->fresh()->hasVerifiedEmail());
        }
    }

    public function test_changing_email_invalidates_old_links(): void
    {
        $admin = $this->admin();
        $links = [$this->link($admin, 'verification.verify'), $this->link($admin, 'admin.email.verify')];
        $admin->update(['email' => 'changed@example.test']);
        $this->actingAs($admin);
        foreach ($links as $link) {
            $this->get($link)->assertForbidden();
        }
        $this->assertFalse($admin->fresh()->hasVerifiedEmail());
    }

    public function test_both_routes_verify_only_once_and_dispatch_verified_event(): void
    {
        Event::fake([Verified::class]);
        foreach (['verification.verify', 'admin.email.verify'] as $route) {
            $admin = $this->admin();
            $link = $this->link($admin, $route);
            $this->actingAs($admin)->get($link)->assertRedirect();
            $verifiedAt = $admin->fresh()->email_verified_at;
            $this->assertNotNull($verifiedAt);
            $this->get($link)->assertRedirect(route('admin.dashboard'));
            $this->assertEquals($verifiedAt, $admin->fresh()->email_verified_at);
        }
        Event::assertDispatchedTimes(Verified::class, 2);
    }

    public function test_actual_notification_link_verifies_current_email(): void
    {
        Notification::fake();
        $admin = $this->admin();
        $this->actingAs($admin)->post(route('verification.send'))->assertSessionHas('status', 'verification-link-sent');
        Notification::assertSentTo($admin, VerifyEmail::class, function ($notification) use ($admin) {
            $mail = $notification->toMail($admin);
            $this->get($mail->actionUrl)->assertRedirect();
            return $admin->fresh()->hasVerifiedEmail();
        });
    }

    public function test_verified_admin_is_redirected_without_sending_more_mail(): void
    {
        Notification::fake();
        Mail::fake();
        $admin = User::factory()->create(['is_admin' => true, 'first_login' => false]);
        $this->actingAs($admin)->post(route('verification.send'))->assertRedirect(route('admin.dashboard'));
        $this->post(route('admin.email.resend'))->assertRedirect(route('admin.dashboard'));
        Notification::assertNothingSent();
        Mail::assertNothingSent();
    }

    public function test_resend_limits_apply_to_standard_and_legacy_routes(): void
    {
        Notification::fake();
        Mail::fake();
        foreach (['verification.send', 'admin.email.resend'] as $route) {
            $this->actingAs($this->admin());
            for ($i = 0; $i < 6; $i++) {
                $this->post(route($route))->assertRedirect();
            }
            $this->post(route($route))->assertStatus(429);
        }
    }

    public function test_email_change_requires_password_and_sends_link_for_new_address(): void
    {
        $sentLink = null;
        Mail::shouldReceive('raw')->once()->withArgs(function ($text, $callback) use (&$sentLink) {
            $message = new \Illuminate\Mail\Message(new \Symfony\Component\Mime\Email);
            $callback($message);
            $this->assertSame('new@example.test', $message->getSymfonyMessage()->getTo()[0]->getAddress());
            preg_match('~https?://[^\s]+~', $text, $matches);
            $sentLink = $matches[0] ?? null;
            $this->assertNotNull($sentLink);
            return true;
        });
        $admin = User::factory()->create(['is_admin' => true, 'first_login' => false]);
        $oldEmail = $admin->email;
        $this->actingAs($admin)->put(route('admin.settings.email.update'), [
            'email' => 'new@example.test', 'current_password' => 'wrong',
        ])->assertSessionHasErrors('current_password');
        $this->assertSame($oldEmail, $admin->fresh()->email);
        $this->put(route('admin.settings.email.update'), [
            'email' => 'new@example.test', 'current_password' => 'password',
        ])->assertRedirect(route('admin.email-verification'))->assertSessionHas('status', 'verification-link-sent');
        $this->assertSame('new@example.test', $admin->fresh()->email);
        $this->assertFalse($admin->fresh()->hasVerifiedEmail());
        $this->get(route('admin.dashboard'))->assertRedirect(route('verification.notice'));
        $this->get($sentLink)->assertRedirect(route('admin.dashboard'));
        $this->assertTrue($admin->fresh()->hasVerifiedEmail());
    }
}
