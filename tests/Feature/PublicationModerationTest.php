<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicationModerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        config(['inertia.ssr.enabled' => false]);
        config(['services.openai.key' => 'test-key', 'services.openai.moderation_enabled' => true]);
        Http::preventStrayRequests();
        $this->actingAs(User::factory()->create());
    }

    private function response(bool $flagged): array
    {
        return ['model' => 'omni-moderation-latest', 'results' => [[
            'flagged' => $flagged, 'categories' => ['harassment' => $flagged],
            'category_scores' => ['harassment' => $flagged ? 0.9 : 0.01],
        ]]];
    }

    private function image(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent('photo.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));
    }

    public function test_safe_comment_is_analyzed_and_saved(): void
    {
        Http::fake(['api.openai.com/v1/moderations' => Http::response($this->response(false))]);
        $post = Post::create(['fk_user_id' => auth()->id(), 'content' => 'Original']);
        $this->post(route('posts.comments.store', $post), ['content' => 'Gostei da leitura.'])
            ->assertSessionHasNoErrors()->assertRedirect();
        $this->assertDatabaseHas('post_comments', ['post_id' => $post->id, 'content' => 'Gostei da leitura.']);
        Http::assertSent(fn ($request) => $request->data()['input'] === 'Gostei da leitura.');
    }

    public function test_flagged_comment_is_not_saved_even_with_spoofed_result(): void
    {
        Http::fake(['api.openai.com/v1/moderations' => Http::response($this->response(true))]);
        $post = Post::create(['fk_user_id' => auth()->id(), 'content' => 'Original']);
        $this->post(route('posts.comments.store', $post), [
            'content' => 'Texto sinalizado', 'skip_moderation' => true,
            'moderation_result' => ['flagged' => false],
        ])->assertSessionHasErrors(['content', 'moderation']);
        $this->assertDatabaseCount('post_comments', 0);
        $this->assertDatabaseCount('reader_notifications', 0);
    }

    public function test_api_failure_or_invalid_response_does_not_save_comment(): void
    {
        $post = Post::create(['fk_user_id' => auth()->id(), 'content' => 'Original']);
        foreach ([Http::response([], 503), Http::response(['results' => []])] as $response) {
            Http::fake(['api.openai.com/v1/moderations' => $response]);
            $this->post(route('posts.comments.store', $post), ['content' => 'Comentário'])
                ->assertSessionHasErrors('content');
        }
        $this->assertDatabaseCount('post_comments', 0);
    }

    public function test_missing_key_does_not_save_unchecked_comment(): void
    {
        config(['services.openai.key' => '']);
        $post = Post::create(['fk_user_id' => auth()->id(), 'content' => 'Original']);
        $this->post(route('posts.comments.store', $post), ['content' => 'Comentário'])
            ->assertSessionHasErrors('content');
        $this->assertDatabaseCount('post_comments', 0);
        Http::assertNothingSent();
    }

    public function test_safe_text_is_analyzed_before_publication(): void
    {
        Http::fake(['api.openai.com/v1/moderations' => Http::response($this->response(false))]);
        $this->post(route('posts.store'), ['content' => 'Uma boa leitura.'])
            ->assertSessionHasNoErrors()->assertRedirect(route('list'));
        $this->assertDatabaseHas('posts', ['content' => 'Uma boa leitura.']);
        Http::assertSent(fn ($request) => $request->data() === ['model' => 'omni-moderation-latest', 'input' => 'Uma boa leitura.']);
    }

    public function test_flagged_text_does_not_save_post_or_upload_even_with_spoofed_result(): void
    {
        Storage::fake('public');
        Http::fake(['api.openai.com/v1/moderations' => Http::response($this->response(true))]);
        $this->post(route('posts.store'), [
            'content' => 'Texto sinalizado', 'image' => $this->image(),
            'moderation_result' => ['flagged' => false], 'skip_moderation' => true,
        ])->assertSessionHasErrors(['content', 'moderation']);
        $this->assertDatabaseCount('posts', 0);
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    public function test_api_failure_does_not_publish_unchecked_text(): void
    {
        Http::fake(['api.openai.com/v1/moderations' => Http::response([], 503)]);
        $this->post(route('posts.store'), ['content' => 'Texto'])->assertSessionHasErrors('content');
        $this->assertArrayNotHasKey('moderation', session('errors')->getBag('default')->messages());
        $this->assertDatabaseCount('posts', 0);
    }

    public function test_edits_cannot_bypass_moderation_and_ownership_is_checked_first(): void
    {
        Http::fake(['api.openai.com/v1/moderations' => Http::response($this->response(true))]);
        $post = Post::create(['fk_user_id' => auth()->id(), 'content' => 'Original']);
        $this->patch(route('posts.update', $post), ['content' => 'Sinalizado'])->assertSessionHasErrors(['content', 'moderation']);
        $this->assertSame('Original', $post->fresh()->content);
        Http::assertSentCount(1);
        $this->actingAs(User::factory()->create())->patch(route('posts.update', $post), ['content' => 'Outro'])->assertForbidden();
        Http::assertSentCount(1);
    }

    public function test_image_only_posts_keep_existing_flow_without_sending_image(): void
    {
        Storage::fake('public');
        $this->post(route('posts.store'), ['image' => $this->image()])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('posts', 1);
        Http::assertNothingSent();
    }

    public function test_disabled_integration_preserves_existing_publication_flow(): void
    {
        config(['services.openai.moderation_enabled' => false]);
        $this->post(route('posts.store'), ['content' => 'Texto'])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('posts', 1);
        Http::assertNothingSent();
    }
}
