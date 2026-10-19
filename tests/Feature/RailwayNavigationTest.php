<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;
use Tighten\Ziggy\Ziggy;

class RailwayNavigationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        config(['inertia.ssr.enabled' => false, 'trustedproxy.proxies' => '*']);
        \Tighten\Ziggy\BladeRouteGenerator::$generated = false;
        $this->withHeader('X-Inertia-Version', app(\App\Http\Middleware\HandleInertiaRequests::class)->version(Request::create('/')) ?? '');
        $this->withServerVariables([
            'REMOTE_ADDR' => '10.0.0.1', 'HTTP_HOST' => 'lumi.example',
            'HTTP_X_FORWARDED_PROTO' => 'https', 'HTTP_X_FORWARDED_PORT' => '443',
        ]);
    }

    protected function tearDown(): void
    {
        TrustProxies::flushState();
        Request::setTrustedProxies([], 0);
        parent::tearDown();
    }

    public function test_proxy_drives_laravel_and_ziggy_urls_and_ignores_forwarded_host(): void
    {
        Route::get('/_test/urls', fn () => [
            'login' => route('login'), 'register' => route('register'),
            'catalogo' => route('catalogo'), 'ziggy' => (new Ziggy)->toArray()['url'],
        ])->middleware('web');
        $this->withHeader('X-Forwarded-Host', 'untrusted.example')->get('http://lumi.example/_test/urls')
            ->assertOk()->assertExactJson([
                'login' => 'https://lumi.example/login', 'register' => 'https://lumi.example/register',
                'catalogo' => 'https://lumi.example/catalogo', 'ziggy' => 'https://lumi.example',
            ]);
    }

    public function test_guest_pages_and_inertia_navigation_work_over_proxy_https(): void
    {
        foreach (['/' => 'welcome', '/login' => 'auth/login', '/register' => 'auth/register', '/catalogo' => 'catalogo'] as $path => $component) {
            \Tighten\Ziggy\BladeRouteGenerator::$generated = false;
            $this->get('http://lumi.example'.$path)->assertOk()
                ->assertSee('"url":"https:\/\/lumi.example"', false);
            $this->withHeader('X-Inertia', 'true')->get('http://lumi.example'.$path)
                ->assertOk()->assertJsonPath('component', $component);
            unset($this->defaultHeaders['X-Inertia']);
        }
    }

    public function test_valid_login_redirects_over_https_and_invalid_login_shares_visible_errors(): void
    {
        $user = User::factory()->create();
        $this->from('https://lumi.example/login')->post('http://lumi.example/login', [
            'email' => $user->email, 'password' => 'incorrect',
        ])->assertRedirect('https://lumi.example/login')->assertSessionHasErrors('email');
        $this->withHeader('X-Inertia', 'true')->get('http://lumi.example/login')
            ->assertOk()->assertJsonPath('props.errors.email', __('auth.failed'));
        $this->post('http://lumi.example/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('https://lumi.example/dashboard');
        $this->assertAuthenticatedAs($user);
        $this->get('http://lumi.example/dashboard')->assertOk()->assertJsonPath('props.auth.user.id', $user->id);
    }

    public function test_csrf_remains_required_and_valid_session_token_allows_login(): void
    {
        $this->app->bind(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class, fn ($app) => new class($app, $app['encrypter']) extends \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken {
            protected function runningUnitTests() { return false; }
        });
        $user = User::factory()->create();
        $this->post('http://lumi.example/login', ['email' => $user->email, 'password' => 'password'])->assertStatus(419);
        $this->assertGuest();
        $this->withSession(['_token' => 'test-csrf-token'])->withHeader('X-CSRF-TOKEN', 'test-csrf-token')
            ->post('http://lumi.example/login', ['email' => $user->email, 'password' => 'password'])
            ->assertRedirect('https://lumi.example/dashboard');
        $this->assertAuthenticatedAs($user);
    }

    public function test_production_cookie_settings_keep_session_secure_and_host_scoped(): void
    {
        config(['session.secure' => true, 'session.domain' => null, 'session.same_site' => 'lax']);
        $response = $this->get('http://lumi.example/login')->assertOk();
        $cookies = collect($response->headers->getCookies())->keyBy(fn ($cookie) => $cookie->getName());
        $session = $cookies->get(config('session.cookie'));
        $this->assertNotNull($session);
        $this->assertTrue($session->isSecure());
        $this->assertTrue($session->isHttpOnly());
        $this->assertEmpty($session->getDomain());
        $this->assertSame('lax', $session->getSameSite());
        $this->assertTrue($cookies->get('XSRF-TOKEN')->isSecure());
    }

    public function test_local_http_remains_http_without_trusted_proxy(): void
    {
        config(['trustedproxy.proxies' => null]);
        $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1', 'HTTP_HOST' => 'localhost', 'HTTP_X_FORWARDED_PROTO' => null, 'HTTP_X_FORWARDED_PORT' => null]);
        $this->get('http://localhost/login')->assertOk()->assertSee('"url":"http:\/\/localhost"', false);
    }
}
