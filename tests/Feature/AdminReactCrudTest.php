<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Models\ReadingRule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminReactCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite()->actingAs(User::factory()->create(['is_admin' => true, 'first_login' => false]));
    }

    public function test_admin_catalog_and_status_paginate_and_filter_on_the_server(): void
    {
        $author = Author::create(['name' => 'João Leitor']);
        $genre = Genre::create(['name' => 'Romance']);
        $available = Availability::create(['availability' => 'Disponível']);
        $unavailable = Availability::create(['availability' => 'Indisponível']);
        $books = collect(range(1, 22))->map(fn (int $number) => Book::create([
            'title' => 'Edição '.$number,
            'page_count' => 100,
            'description' => 'Detalhes reservados ao editor',
            'fk_author_id' => $author->id,
            'fk_genre_id' => $genre->id,
            'fk_availability_id' => $number === 22 ? $unavailable->id : $available->id,
        ]));
        $filters = ['q' => 'joao', 'status' => 'Disponível'];

        foreach (['admin.books.list' => 'admin/books/index', 'admin.books.create' => 'admin/books/availability'] as $route => $component) {
            $initial = $this->get(route($route))->assertInertia(fn (Assert $page) => $page
                ->component($component)->has('books', 20)->where('pagination.total', 22)
                ->where('books.0.id', $books->last()->id)->missing('books.0.description')->missing('books.0.readers_count'));
            $this->get(route($route, [...$filters, 'page' => 2]))->assertInertia(fn (Assert $page) => $page
                ->has('books', 1)->where('books.0.id', $books->first()->id)
                ->where('pagination', ['currentPage' => 2, 'totalPages' => 2, 'first' => 21, 'last' => 21, 'total' => 21])
                ->where('filters', $filters)->has('statuses', 2));
            $this->get(route($route, ['q' => 'edicao 22 joao']))->assertInertia(fn (Assert $page) => $page
                ->has('books', 1)->where('books.0.id', $books->last()->id));
            $this->get(route($route, [...$filters, 'page' => 2]), [
                'X-Inertia' => 'true',
                'X-Inertia-Version' => $initial->inertiaPage()['version'],
                'X-Inertia-Partial-Component' => $component,
                'X-Inertia-Partial-Data' => 'books,filters,pagination',
            ])->assertOk()->assertJsonCount(1, 'props.books')
                ->assertJsonPath('props.pagination.currentPage', 2)->assertJsonMissingPath('props.statuses');
            $this->get(route($route, [...$filters, 'page' => 99]))
                ->assertRedirect(route($route, [...$filters, 'page' => 2]));
        }

        $context = [...$filters, 'page' => 2];
        $this->patch(route('admin.books.availability.update', ['book' => $books->first()->id, ...$context]), [
            'fk_availability_id' => $unavailable->id,
        ])->assertRedirect(route('admin.books.create', $context));

        foreach (['admin.books.list', 'admin.books.create'] as $route) {
            $this->get(route($route, $context))->assertRedirect(route($route, [...$filters, 'page' => 1]));
            $this->get(route($route, $filters))->assertInertia(fn (Assert $page) => $page
                ->has('books', 20)->where('pagination.total', 20));
        }
    }

    public function test_book_upload_edit_and_delete_keep_the_existing_contract(): void
    {
        Storage::fake('public');
        $author = Author::create(['name' => 'Autor']);
        $genre = Genre::create(['name' => 'Romance']);
        $availability = Availability::create(['availability' => 'Disponível']);
        $data = [
            'title' => 'Livro React', 'page_count' => 200, 'publication_year' => 2001,
            'fk_author_id' => $author->id, 'fk_genre_id' => $genre->id,
            'fk_availability_id' => $availability->id, 'description' => 'Descrição da obra',
        ];
        $cover = UploadedFile::fake()->createWithContent('cover.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII='));
        $this->post(route('admin.books.store'), [...$data, 'cover_image' => $cover])
            ->assertRedirect(route('admin.books.create'))->assertSessionHasNoErrors();
        $book = Book::where('title', 'Livro React')->firstOrFail();
        $this->assertSame(2001, (int) $book->publication_year);
        Storage::disk('public')->assertExists($book->cover_url);

        $this->get(route('admin.books.edit', $book->id))->assertInertia(fn (Assert $page) => $page
            ->component('admin/books/edit')->where('book.title', 'Livro React')->has('authors', 1)
            ->has('genres', 1)->has('availabilities', 1));
        $this->post(route('admin.books.update', $book->id), [...$data, '_method' => 'put', 'title' => 'Título atualizado', 'publication_year' => 2026])
            ->assertRedirect(route('admin.books.list'))->assertSessionHasNoErrors();
        $this->assertSame('Título atualizado', $book->fresh()->title);
        $this->assertSame(2026, (int) $book->fresh()->publication_year);
        $this->assertSame($book->cover_url, $book->fresh()->cover_url);

        $this->delete(route('admin.books.destroy', $book->id))->assertRedirect(route('admin.books.list'));
        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }

    public function test_book_status_has_a_dedicated_editor_and_only_updates_availability(): void
    {
        $available = Availability::create(['availability' => 'Disponível']);
        $unavailable = Availability::create(['availability' => 'Indisponível']);
        $book = Book::create([
            'title' => 'Livro de teste',
            'page_count' => 200,
            'fk_author_id' => Author::create(['name' => 'Autor'])->id,
            'fk_genre_id' => Genre::create(['name' => 'Romance'])->id,
            'fk_availability_id' => $available->id,
        ]);
        $editor = route('admin.books.availability.edit', $book);
        $update = route('admin.books.availability.update', $book);

        $this->get($editor)->assertInertia(fn (Assert $page) => $page
            ->component('admin/books/edit-availability')->where('book.availability.id', $available->id)
            ->has('availabilities', 2));
        $this->from($editor)->patch($update, ['fk_availability_id' => 999999])
            ->assertRedirect($editor)->assertSessionHasErrors('fk_availability_id');
        $this->patch($update, ['fk_availability_id' => $unavailable->id, 'title' => 'Alteração indevida'])
            ->assertRedirect(route('admin.books.create'))->assertSessionHasNoErrors();
        $this->assertDatabaseHas('books', [
            'id' => $book->id,
            'title' => 'Livro de teste',
            'fk_availability_id' => $unavailable->id,
        ]);
    }

    public function test_categories_return_to_their_react_list_after_writes(): void
    {
        foreach ([['authors', Author::class, 'name'], ['genres', Genre::class, 'name'], ['availability', Availability::class, 'availability']] as [$resource, $model, $field]) {
            $index = route("admin.$resource.index");
            $this->from($index)->post(route("admin.$resource.store"), [$field => 'Novo registro'])
                ->assertRedirect($index)->assertSessionHasNoErrors();
            $item = $model::where($field, 'Novo registro')->firstOrFail();
            $this->put(route("admin.$resource.update", $item->id), [$field => 'Registro atualizado'])
                ->assertRedirect($index)->assertSessionHasNoErrors();
            $this->get($index)->assertInertia(fn (Assert $page) => $page->component('admin/categories/manage')
                ->where('resource', $resource)->where("items.0.$field", 'Registro atualizado'));
            $this->delete(route("admin.$resource.destroy", $item->id))->assertRedirect($index);
            $this->assertDatabaseMissing($item->getTable(), ['id' => $item->id]);
        }
    }

    public function test_validation_is_shared_with_react_without_changing_data(): void
    {
        $this->from(route('admin.books.index'))->post(route('admin.books.store'), [])
            ->assertSessionHasErrors(['title', 'page_count', 'fk_author_id', 'fk_genre_id', 'fk_availability_id']);
        $this->get(route('admin.books.index'))->assertInertia(fn (Assert $page) => $page
            ->component('admin/books/create')->has('errors.title')->has('errors.page_count'));
        $this->assertDatabaseCount('books', 0);
    }

    public function test_profile_and_password_still_use_admin_endpoints(): void
    {
        $user = auth()->user();
        $this->post(route('admin.settings.profile.update'), [
            'name' => 'Perfil atualizado', 'nickname' => 'admin-atualizado', 'description' => 'Administração da biblioteca',
        ])->assertRedirect(route('admin.dashboard'))->assertSessionHasNoErrors();
        $this->assertSame('Perfil atualizado', $user->fresh()->name);
        $this->put(route('admin.settings.password.update'), [
            'current_password' => 'password', 'password' => 'senha-atualizada', 'password_confirmation' => 'senha-atualizada',
        ])->assertRedirect(route('admin.dashboard'))->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('senha-atualizada', $user->fresh()->password));
    }

    public function test_reader_cannot_view_or_write_admin_resources(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => false]));
        $this->get(route('admin.reading-rules.index'))->assertRedirect(route('dashboard'));
        $this->post(route('admin.reading-rules.store'), ['text' => 'Não autorizado'])->assertRedirect(route('dashboard'));
        $this->get(route('admin.books.index'))->assertRedirect(route('dashboard'));
        $this->post(route('admin.authors.store'), ['name' => 'Não autorizado'])->assertRedirect(route('dashboard'));
        $this->assertDatabaseMissing('authors', ['name' => 'Não autorizado']);
    }

    public function test_reading_rules_crud_is_reflected_on_reader_pages(): void
    {
        $admin = auth()->user();
        $index = route('admin.reading-rules.index');
        $this->get($index)->assertInertia(fn (Assert $page) => $page->component('admin/reading-rules/index')->has('rules', 6));
        $this->from($index)->post(route('admin.reading-rules.store'), ['text' => ''])->assertSessionHasErrors('text');
        $this->post(route('admin.reading-rules.store'), ['text' => 'Regra nova'])->assertRedirect($index);
        $rule = ReadingRule::where('text', 'Regra nova')->firstOrFail();
        $this->patch(route('admin.reading-rules.update', $rule), ['text' => 'Regra atualizada'])->assertRedirect($index);

        $reader = User::factory()->create(['is_admin' => false]);
        $this->actingAs($reader);
        foreach (['reading.rules', 'dashboard', 'profile'] as $name) {
            $this->get(route($name))->assertInertia(fn (Assert $page) => $page
                ->has('readingRules', 7)->where('readingRules.6.text', 'Regra atualizada'));
        }
        $this->delete(route('admin.reading-rules.destroy', $rule))->assertRedirect(route('dashboard'));
        $this->assertModelExists($rule);

        $this->actingAs($admin)->delete(route('admin.reading-rules.destroy', $rule))->assertRedirect($index);
        $this->actingAs($reader)->get(route('reading.rules'))
            ->assertInertia(fn (Assert $page) => $page->has('readingRules', 6));
    }
}
