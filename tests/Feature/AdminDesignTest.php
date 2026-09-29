<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminDesignTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_administrative_routes_render_react_pages(): void
    {
        $this->withoutVite()->actingAs(User::factory()->create([
            'name' => 'Administrador de teste', 'is_admin' => true, 'first_login' => false,
        ]));
        $author = Author::create(['name' => 'Autor de teste']);
        $genre = Genre::create(['name' => 'Romance']);
        $availability = Availability::create(['availability' => 'Disponível']);
        $book = Book::create([
            'title' => 'Livro de teste', 'page_count' => 150,
            'fk_author_id' => $author->id, 'fk_genre_id' => $genre->id, 'fk_availability_id' => $availability->id,
        ]);

        $pages = [
            'admin.dashboard' => ['admin/dashboard', []],
            'admin.reports.index' => ['admin/reports/index', []],
            'admin.categories.index' => ['admin/categories/index', []],
            'admin.catalog.index' => ['admin/catalog/index', []],
            'admin.settings.index' => ['admin/settings/index', []],
            'admin.credentials.edit' => ['admin/settings/profile', []],
            'admin.settings.email.edit' => ['admin/settings/email', []],
            'admin.settings.password.edit' => ['admin/settings/password', []],
            'admin.admins.create' => ['admin/settings/create-admin', []],
            'admin.admins.index' => ['admin/settings/admins', []],
            'admin.genres.index' => ['admin/categories/manage', []],
            'admin.genres.edit' => ['admin/categories/edit', [$genre->id]],
            'admin.authors.index' => ['admin/categories/manage', []],
            'admin.authors.edit' => ['admin/categories/edit', [$author->id]],
            'admin.availability.index' => ['admin/categories/manage', []],
            'admin.availability.edit' => ['admin/categories/edit', [$availability->id]],
            'admin.books.index' => ['admin/books/create', []],
            'admin.books.list' => ['admin/books/index', []],
            'admin.books.create' => ['admin/books/availability', []],
            'admin.books.edit' => ['admin/books/edit', [$book->id]],
        ];

        foreach ($pages as $routeName => [$component, $parameters]) {
            $this->withoutHeader('X-Inertia')->get(route($routeName, $parameters))->assertOk()
                ->assertInertia(fn (Assert $page) => $page->component($component)->where('auth.user.is_admin', true));
            $this->withHeaders(['X-Inertia' => 'true', 'X-Inertia-Version' => Inertia::getVersion()])->get(route($routeName, $parameters))
                ->assertOk()->assertHeader('X-Inertia', 'true')->assertJsonPath('component', $component);
        }
    }

    public function test_first_access_and_verification_share_the_onboarding_design(): void
    {
        $this->withoutVite()->actingAs(User::factory()->create(['is_admin' => true, 'first_login' => true]));
        $this->get(route('admin.dashboard'))->assertRedirect(route('admin.first-login'));

        $response = $this->get(route('admin.first-login'));
        $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/settings/first-login'));

        $this->get(route('admin.email-verification'))->assertRedirect(route('verification.notice'));
        $this->actingAs(User::factory()->unverified()->create(['is_admin' => true, 'first_login' => false]));
        $response = $this->get(route('verification.notice'));
        $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/settings/verify-email'));
    }

    public function test_first_access_submission_keeps_existing_redirect_and_validation(): void
    {
        Notification::fake();
        $admin = User::factory()->unverified()->create(['is_admin' => true, 'first_login' => true]);
        $this->actingAs($admin)->post(route('admin.credentials.update'), [])
            ->assertSessionHasErrors(['name', 'nickname', 'current_password', 'password']);

        $this->post(route('admin.credentials.update'), [
            'name' => 'Administrador', 'nickname' => 'admin-teste', 'email' => $admin->email,
            'current_password' => 'password', 'password' => 'nova-senha-segura', 'password_confirmation' => 'nova-senha-segura',
        ])->assertRedirect(route('verification.notice'));
        $this->assertFalse((bool) $admin->fresh()->first_login);
    }
}
