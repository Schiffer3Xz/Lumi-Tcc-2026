<?php

namespace Tests\Feature;

use App\Jobs\ModerateReport;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use App\Services\Moderation\OpenAiModeration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportRemovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_reported_comment_can_be_removed_by_admin_even_when_the_api_does_not_flag_it(): void
    {
        Queue::fake();
        Http::preventStrayRequests();
        config(['services.openai.key' => 'test-key', 'services.openai.moderation_enabled' => true]);
        Http::fake(['api.openai.com/v1/moderations' => Http::response([
            'model' => 'omni-moderation-latest', 'results' => [[
                'flagged' => false, 'categories' => ['harassment' => false], 'category_scores' => ['harassment' => 0.01],
            ]],
        ])]);
        [$author, $reader, $admin] = User::factory()->count(3)->create()->all();
        $admin->update(['is_admin' => true, 'first_login' => false]);
        $post = Post::create(['fk_user_id' => $author->id, 'content' => 'Keep post']);
        $comment = $post->comments()->create(['user_id' => $author->id, 'content' => 'Reported comment']);
        $other = $post->comments()->create(['user_id' => $author->id, 'content' => 'Keep comment']);
        $this->actingAs($reader)->post(route('posts.comments.report', [$post, $comment]), [
            'content' => 'Review requested', 'fk_user_id' => $author->id, 'fk_comment_id' => $other->id,
        ])->assertSessionHasNoErrors();
        $report = Report::sole();
        $this->assertSame($reader->id, $report->fk_user_id);
        $this->assertSame($comment->id, $report->fk_comment_id);
        Queue::assertPushed(ModerateReport::class);
        (new ModerateReport($report->id, $report->moderation_token))->handle(app(OpenAiModeration::class));
        $this->assertFalse($report->fresh()->moderation_result['flagged']);
        $this->withoutVite()->actingAs($admin)->get(route('admin.reports.index'))->assertInertia(fn (Assert $page) => $page
            ->where('reports.data.0.target.type', 'comment')->where('reports.data.0.target.deleted', false));
        $this->from(route('admin.reports.index'))->delete(route('admin.reports.target.destroy', $report), [
            'review_note' => 'Removed after manual review.',
        ])->assertRedirect(route('admin.reports.index'))->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('post_comments', ['id' => $comment->id]);
        $this->assertDatabaseHas('post_comments', ['id' => $other->id]);
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
        $report->refresh();
        $this->assertSame('reviewed', $report->status);
        $this->assertSame($admin->id, $report->reviewed_by);
        $this->assertSame('Removed after manual review.', $report->review_note);
        $this->assertSame('Reported comment', $report->target_snapshot['content']);
        $this->assertFalse($report->moderation_result['flagged']);
        $this->get(route('admin.reports.index', ['status' => 'all']))->assertInertia(fn (Assert $page) => $page
            ->where('reports.data.0.target.type', 'comment')->where('reports.data.0.target.deleted', true));
        // A repeated request must never fall back to deleting the parent post.
        $this->delete(route('admin.reports.target.destroy', $report))->assertSessionHasNoErrors();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_comment_reports_validate_the_parent_and_reason_and_deduplicate_pending_submissions(): void
    {
        $reader = User::factory()->create();
        $first = Post::create(['fk_user_id' => $reader->id, 'content' => 'First']);
        $second = Post::create(['fk_user_id' => $reader->id, 'content' => 'Second']);
        $comment = $first->comments()->create(['user_id' => $reader->id, 'content' => 'Comment']);
        $url = route('posts.comments.report', [$first, $comment]);
        $this->postJson($url, ['content' => 'Reason'])->assertUnauthorized();
        $this->actingAs($reader)->postJson(route('posts.comments.report', [$second, $comment]), ['content' => 'Reason'])->assertNotFound();
        $this->postJson($url, ['content' => str_repeat('a', 101)])->assertUnprocessable();
        $this->post($url, ['content' => 'Reason'])->assertSessionHasNoErrors();
        $this->post($url, ['content' => 'Repeated'])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('reports', 1);
    }

    public function test_guests_and_readers_cannot_remove_reported_content(): void
    {
        $reader = User::factory()->create();
        $post = Post::create(['fk_user_id' => $reader->id, 'content' => 'Keep']);
        $report = Report::create(['fk_user_id' => $reader->id, 'fk_post_id' => $post->id, 'content' => 'Reason']);
        $url = route('admin.reports.target.destroy', $report);
        $this->delete($url)->assertRedirect(route('login'));
        $this->actingAs($reader)->delete($url)->assertRedirect(route('dashboard'));
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
        $this->assertSame('pending', $report->fresh()->status);
    }

    public function test_admin_can_remove_a_publication_without_waiting_for_automatic_analysis(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'first_login' => false]);
        foreach (['pending', 'unavailable', 'completed'] as $status) {
            $post = Post::create(['fk_user_id' => $admin->id, 'content' => 'Reported post']);
            $report = Report::create(['fk_user_id' => $admin->id, 'fk_post_id' => $post->id, 'content' => 'Reason']);
            $report->forceFill(['moderation_status' => $status])->save();
            $this->actingAs($admin)->delete(route('admin.reports.target.destroy', $report))->assertSessionHasNoErrors();
            $this->assertDatabaseMissing('posts', ['id' => $post->id]);
            $this->assertSame('Reported post', $report->fresh()->target_snapshot['content']);
            $this->assertSame($status, $report->fresh()->moderation_status);
        }
    }

    public function test_invalid_review_note_does_not_remove_content(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'first_login' => false]);
        $post = Post::create(['fk_user_id' => $admin->id, 'content' => 'Keep']);
        $report = Report::create(['fk_user_id' => $admin->id, 'fk_post_id' => $post->id, 'content' => 'Reason']);
        $this->actingAs($admin)->delete(route('admin.reports.target.destroy', $report), ['review_note' => str_repeat('a', 2001)])
            ->assertSessionHasErrors('review_note');
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
        $this->assertSame('pending', $report->fresh()->status);
    }
}
