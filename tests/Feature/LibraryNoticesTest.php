<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Availability;
use App\Models\Book;
use App\Models\Genre;
use App\Models\Post;
use App\Models\User;
use App\Services\Moderation\PublicationModeration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LibraryNoticesTest extends TestCase
{
    use RefreshDatabase;

    public function test_expired_notice_leaves_the_public_board_and_notification_inbox(): void
    {
        $this->freezeSecond();
        $admin = User::factory()->create(['is_admin' => true, 'first_login' => false]);
        $reader = User::factory()->create();
        $this->withoutVite()->actingAs($admin)->post(route('admin.library-notices.store'), [
            'content' => 'Horário especial.',
            'duration' => '1h',
        ])->assertRedirect(route('admin.library-notices.index'));

        $notice = Post::libraryNotices()->sole();
        $this->assertTrue($notice->notice_expires_at->equalTo(now()->addHour()));
        $notification = DB::table('reader_notifications')->where('user_id', $reader->id)->sole();
        $this->actingAs($reader)->get(route('list'))->assertInertia(fn (Assert $page) => $page
            ->has('libraryNotices.data', 1)->where('unreadNotifications', 1));

        $this->travel(1)->hour();
        $this->get(route('list'))->assertInertia(fn (Assert $page) => $page
            ->has('libraryNotices.data', 0)->where('unreadNotifications', 0));
        $this->getJson(route('notifications'))->assertJsonCount(0, 'notifications.data');
        $this->post(route('notifications.open', $notification->id))->assertNotFound();
        $this->get(route('list', ['notice' => $notice->id]))->assertNotFound();
        $this->actingAs($admin)->get(route('admin.library-notices.index'))->assertInertia(fn (Assert $page) => $page
            ->where('notices.data.0.id', $notice->id));
    }

    public function test_publishing_notifies_every_account_and_opening_records_the_individual_read(): void
    {
        Storage::fake('public');
        $this->mock(PublicationModeration::class, function ($mock) {
            $mock->shouldReceive('validate')->twice();
            $mock->shouldReceive('moderateImage')->twice();
        });
        $admin = User::factory()->create(['name' => 'Daniel Robersvaldo', 'is_admin' => true, 'first_login' => false]);
        $reader = User::factory()->create(['social_notifications' => false]);
        $other = User::factory()->create();
        $bookData = [
            'page_count' => 120,
            'fk_author_id' => Author::create(['name' => 'Autor'])->id,
            'fk_genre_id' => Genre::create(['name' => 'Ficção'])->id,
            'fk_availability_id' => Availability::create(['availability' => 'Disponível'])->id,
        ];
        $first = Book::create(['title' => 'Livro um', ...$bookData]);
        $second = Book::create(['title' => 'Livro dois', ...$bookData]);
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=');
        $this->withoutVite()->actingAs($admin)->get(route('admin.library-notices.create'))
            ->assertInertia(fn (Assert $page) => $page->component('admin/library-notices/form'));
        $this->getJson(route('admin.library-notices.books', ['q' => 'um']))
            ->assertJsonCount(1, 'books')->assertJsonPath('books.0.id', $first->id);
        $this->post(route('admin.library-notices.store'), [
            'content' => 'Temos livros para doação.',
            'images' => [UploadedFile::fake()->createWithContent('one.png', $png), UploadedFile::fake()->createWithContent('two.png', $png)],
            'book_ids' => [$first->id, $second->id],
        ])->assertRedirect(route('admin.library-notices.index'))->assertSessionHasNoErrors();
        $notice = Post::libraryNotices()->sole();
        $this->assertSame($admin->id, $notice->fk_user_id);
        $this->assertCount(2, $notice->notice_images);
        Storage::disk('public')->assertExists($notice->notice_images);
        $this->assertDatabaseCount('reader_notifications', 3);
        $this->assertDatabaseCount('library_notice_books', 2);

        $this->post(route('admin.library-notices.store'), ['content' => 'Novo horário.'])
            ->assertRedirect(route('admin.library-notices.index'));
        $latest = Post::libraryNotices()->latest('id')->first();
        $this->actingAs($reader)->get(route('list'))->assertInertia(fn (Assert $page) => $page
            ->has('posts', 0)->has('libraryNotices.data', 2)->where('libraryNotices.data.0.id', $latest->id)
            ->where('libraryNotices.data.1.author.name', $admin->name)
            ->where('libraryNotices.data.1.hasRead', false));
        $this->getJson(route('notifications'))->assertJsonPath('notifications.data.1.excerpt', 'Temos livros para doação.');
        $this->post(route('notifications.read'))->assertRedirect();
        $this->assertDatabaseCount('library_notice_reads', 0);

        $notification = DB::table('reader_notifications')->where('user_id', $reader->id)->where('post_id', $notice->id)->sole();
        $target = route('list', ['notice' => $notice->id]);
        $this->post(route('notifications.open', $notification->id))->assertRedirect($target);
        $this->get($target)->assertInertia(fn (Assert $page) => $page
            ->where('selectedNotice.id', $notice->id)->has('selectedNotice.images', 2)->has('selectedNotice.books', 2));
        $this->get($target)->assertOk();
        $this->assertDatabaseCount('library_notice_reads', 1);
        $this->assertDatabaseHas('library_notice_reads', ['user_id' => $reader->id, 'post_id' => $notice->id]);
        $this->actingAs($other)->post(route('notifications.open', $notification->id))->assertNotFound();
        $this->put(route('posts.like', $notice->id))->assertNotFound();
        $this->post(route('admin.library-notices.store'), ['content' => 'Acesso indevido.'])->assertRedirect(route('dashboard'));
        $this->assertDatabaseCount('posts', 2);
    }

    public function test_author_and_explicit_managers_can_edit_and_remove_without_erasing_the_history(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'first_login' => false]);
        $otherAdmin = User::factory()->create(['is_admin' => true, 'first_login' => false]);
        $reader = User::factory()->create();
        $this->withoutVite()->actingAs($admin)->post(route('admin.library-notices.store'), ['content' => 'Horário de atendimento.'])
            ->assertRedirect(route('admin.library-notices.index'));
        $notice = Post::libraryNotices()->sole();
        $noticeId = $notice->id;
        $this->patch(route('admin.library-notices.update', $noticeId), ['content' => 'Horário atualizado.'])
            ->assertRedirect(route('admin.library-notices.index'));
        $this->assertDatabaseCount('reader_notifications', 3);
        $this->actingAs($otherAdmin)->get(route('admin.library-notices.edit', $noticeId))->assertForbidden();
        $this->delete(route('admin.library-notices.destroy', $noticeId))->assertForbidden();

        config(['services.library_notices.manager_ids' => [$otherAdmin->id]]);
        $this->get(route('admin.library-notices.edit', $noticeId))->assertOk();
        $this->delete(route('admin.library-notices.destroy', $noticeId))->assertRedirect(route('admin.library-notices.index'));
        $archived = $notice->fresh();
        $this->assertNotNull($archived->notice_removed_at);
        $this->assertTrue($notice->created_at->equalTo($archived->created_at));
        $this->assertSame($admin->id, $archived->fk_user_id);
        $this->assertDatabaseCount('reader_notifications', 0);
        $this->get(route('admin.library-notices.index'))->assertInertia(fn (Assert $page) => $page
            ->has('notices.data', 1)->where('notices.data.0.content', 'Horário atualizado.')->where('notices.data.0.canManage', false));
        $this->actingAs($reader)->get(route('list'))->assertInertia(fn (Assert $page) => $page->has('libraryNotices.data', 0));
        $this->get(route('list', ['notice' => $noticeId]))->assertNotFound();
    }
}
