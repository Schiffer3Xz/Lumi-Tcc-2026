<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AdminDesignTest extends TestCase
{
    use RefreshDatabase;

    public function test_administrative_pages_render_with_shared_navigation(): void
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
            'admin.dashboard' => [], 'admin.categories.index' => [], 'admin.catalog.index' => [],
            'admin.settings.index' => [], 'admin.credentials.edit' => [], 'admin.settings.email.edit' => [],
            'admin.settings.password.edit' => [], 'admin.admins.create' => [], 'admin.admins.index' => [],
            'admin.genres.index' => [], 'admin.genres.edit' => [$genre->id],
            'admin.authors.index' => [], 'admin.authors.edit' => [$author->id],
            'admin.availability.index' => [], 'admin.availability.edit' => [$availability->id],
            'admin.books.index' => [], 'admin.books.list' => [], 'admin.books.create' => [], 'admin.books.edit' => [$book->id],
        ];

        foreach ($pages as $routeName => $parameters) {
            $response = $this->get(route($routeName, $parameters));
            $response->assertOk()->assertSee('admin-sidebar')->assertSee('admin-content')
                ->assertSee('Sala de Leitura')->assertDontSee('cdn.tailwindcss.com');
            $this->savePreview($routeName, $response->getContent());
        }
    }

    public function test_first_access_and_verification_share_the_onboarding_design(): void
    {
        $this->withoutVite()->actingAs(User::factory()->create(['is_admin' => true, 'first_login' => true]));
        $this->get(route('admin.dashboard'))->assertRedirect(route('admin.first-login'));

        $response = $this->get(route('admin.first-login'));
        $response->assertOk()->assertSee('Configurar perfil')->assertSee('Verificar e-mail')
            ->assertSee('name="current_password"', false)->assertSee('name="password_confirmation"', false)
            ->assertSee(route('admin.credentials.update'))->assertDontSee('id="admin-sidebar"', false);
        $this->savePreview('first-access', $response->getContent());

        $this->get(route('admin.email-verification'))->assertRedirect(route('verification.notice'));
        $this->actingAs(User::factory()->unverified()->create(['is_admin' => true, 'first_login' => false]));
        $response = $this->get(route('verification.notice'));
        $response->assertOk()->assertSee('Verifique seu e-mail')->assertDontSee('id="admin-sidebar"', false);
        $this->savePreview('verification', $response->getContent());
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

    private function savePreview(string $name, string $html): void
    {
        if ($directory = getenv('ADMIN_PREVIEW_DIR')) {
            file_put_contents($directory.DIRECTORY_SEPARATOR.$name.'.html', $html);
        }
    }
}
