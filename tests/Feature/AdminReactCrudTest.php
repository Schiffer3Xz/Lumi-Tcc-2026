<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
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

    public function test_book_upload_edit_and_delete_keep_the_existing_contract(): void
    {
        Storage::fake('public');
        $author = Author::create(['name' => 'Autor']);
        $genre = Genre::create(['name' => 'Romance']);
        $availability = Availability::create(['availability' => 'Disponível']);
        $data = [
            'title' => 'Livro React', 'page_count' => 200,
            'fk_author_id' => $author->id, 'fk_genre_id' => $genre->id,
            'fk_availability_id' => $availability->id, 'description' => 'Descrição da obra',
        ];
        $cover = UploadedFile::fake()->createWithContent('cover.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII='));
        $this->post(route('admin.books.store'), [...$data, 'cover_image' => $cover])
            ->assertRedirect(route('admin.books.create'))->assertSessionHasNoErrors();
        $book = Book::where('title', 'Livro React')->firstOrFail();
        Storage::disk('public')->assertExists($book->cover_url);

        $this->get(route('admin.books.edit', $book->id))->assertInertia(fn (Assert $page) => $page
            ->component('admin/books/edit')->where('book.title', 'Livro React')->has('authors', 1)
            ->has('genres', 1)->has('availabilities', 1));
        $this->post(route('admin.books.update', $book->id), [...$data, '_method' => 'put', 'title' => 'Título atualizado'])
            ->assertRedirect(route('admin.books.list'))->assertSessionHasNoErrors();
        $this->assertSame('Título atualizado', $book->fresh()->title);
        $this->assertSame($book->cover_url, $book->fresh()->cover_url);

        $this->delete(route('admin.books.destroy', $book->id))->assertRedirect(route('admin.books.list'));
        $this->assertDatabaseMissing('books', ['id' => $book->id]);
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
        $this->put(route('admin.settings.profile.update'), [
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
        $this->get(route('admin.books.index'))->assertRedirect(route('dashboard'));
        $this->post(route('admin.authors.store'), ['name' => 'Não autorizado'])->assertRedirect(route('dashboard'));
        $this->assertDatabaseMissing('authors', ['name' => 'Não autorizado']);
    }
}
