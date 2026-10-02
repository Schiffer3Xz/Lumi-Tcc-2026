<?php

namespace Tests\Feature;

use App\Jobs\ModerateReport;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use App\Services\Moderation\ModerationUnavailable;
use App\Services\Moderation\OpenAiModeration;
use App\Services\Moderation\ReportModeration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Factory;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportModerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        config(['services.openai.key' => 'test-key-never-real', 'services.openai.moderation_enabled' => true]);
        Http::preventStrayRequests();
        Queue::fake();
    }

    private function report(string $text = 'Texto original'): Report
    {
        $author = User::factory()->create(['name' => 'Autor privado']);
        $post = Post::create(['fk_user_id' => $author->id, 'content' => $text]);

        return Report::create([
            'fk_user_id' => User::factory()->create()->id, 'fk_post_id' => $post->id,
            'content' => 'Motivo privado', 'target_snapshot' => ['content' => $text, 'author' => $author->name, 'image' => 'posts/private.jpg'],
        ]);
    }

    private function response(bool $flagged = true): array
    {
        return ['model' => 'omni-moderation-latest', 'results' => [[
            'flagged' => $flagged, 'categories' => ['harassment' => $flagged, 'violence' => false],
            'category_scores' => ['harassment' => $flagged ? 0.9 : 0.01, 'violence' => 0.01],
        ]]];
    }

    private function enqueue(Report $report): ModerateReport
    {
        app(ReportModeration::class)->enqueue($report);

        return new ModerateReport($report->id, $report->fresh()->moderation_token);
    }

    public function test_new_reports_enqueue_only_once_after_being_saved_and_cannot_spoof_analysis(): void
    {
        $post = Post::create(['fk_user_id' => User::factory()->create()->id, 'content' => 'Texto público']);
        $this->actingAs(User::factory()->create())->post(route('posts.report', $post), [
            'content' => 'Motivo', 'moderation_status' => 'completed', 'moderation_result' => ['flagged' => false],
        ])->assertSessionHasNoErrors();
        $report = Report::sole();
        $this->assertSame('pending', $report->moderation_status);
        $this->assertNull($report->moderation_result);
        Queue::assertPushed(ModerateReport::class, fn ($job) => $job->reportId === $report->id && $job->token === $report->moderation_token);
        $this->post(route('posts.report', $post), ['content' => 'Repetida'])->assertSessionHasNoErrors();
        Queue::assertPushed(ModerateReport::class, 1);
        Http::assertNothingSent();
    }

    public function test_worker_sends_only_original_text_and_keeps_manual_review_and_publication_intact(): void
    {
        Http::fake(['api.openai.com/v1/moderations' => Http::response($this->response())]);
        $report = $this->report();
        $job = $this->enqueue($report);
        $report->post->update(['content' => 'Texto editado depois']);
        $report->update(['status' => 'dismissed', 'review_note' => 'Decisão humana.']);
        $job->handle(app(OpenAiModeration::class));
        Http::assertSent(fn ($request) => $request->url() === 'https://api.openai.com/v1/moderations'
            && $request->method() === 'POST' && $request->hasHeader('Authorization', 'Bearer test-key-never-real')
            && $request->data() === ['model' => 'omni-moderation-latest', 'input' => 'Texto original']);
        $report->refresh();
        $this->assertSame('completed', $report->moderation_status);
        $this->assertTrue($report->moderation_result['flagged']);
        $this->assertSame('dismissed', $report->status);
        $this->assertSame('Decisão humana.', $report->review_note);
        $this->assertNotNull($report->moderated_at);
        $this->assertDatabaseHas('posts', ['id' => $report->fk_post_id, 'content' => 'Texto editado depois']);
        $job->handle(app(OpenAiModeration::class));
        Http::assertSentCount(1);
    }

    public function test_clean_text_is_recorded_without_flagging_it(): void
    {
        Http::fake(['api.openai.com/v1/moderations' => Http::response($this->response(false))]);
        $report = $this->report('Vamos ler um livro.');
        $this->enqueue($report)->handle(app(OpenAiModeration::class));
        $this->assertFalse($report->fresh()->moderation_result['flagged']);
    }

    public function test_disabled_missing_key_and_image_only_reports_never_call_the_api(): void
    {
        foreach ([['services.openai.moderation_enabled' => false], ['services.openai.moderation_enabled' => true, 'services.openai.key' => null]] as $configuration) {
            config($configuration);
            $report = $this->report();
            app(ReportModeration::class)->enqueue($report);
            $this->assertSame('unavailable', $report->fresh()->moderation_status);
        }
        config(['services.openai.key' => 'test-key-never-real']);
        $imageOnly = $this->report('');
        app(ReportModeration::class)->enqueue($imageOnly);
        $this->assertSame('unsupported', $imageOnly->fresh()->moderation_status);
        Queue::assertNothingPushed();
        Http::assertNothingSent();
    }

    public function test_errors_do_not_leak_provider_response_or_credentials_and_keep_report_available(): void
    {
        foreach ([401, 429, 500] as $status) {
            Http::swap(new Factory);
            Http::preventStrayRequests();
            Http::fake(['api.openai.com/v1/moderations' => Http::response(['error' => 'Sensitive provider detail'], $status)]);
            $report = $this->report();
            $job = $this->enqueue($report);
            try {
                $job->handle(app(OpenAiModeration::class));
                $this->fail('Expected sanitized moderation error');
            } catch (ModerationUnavailable $error) {
                $this->assertStringNotContainsString('Sensitive', $error->getMessage());
                $this->assertStringNotContainsString('test-key', $error->getMessage());
                $this->assertNull($error->getPrevious());
                $job->failed($error);
            }
            $this->assertSame('failed', $report->fresh()->moderation_status);
            $this->assertSame('pending', $report->fresh()->status);
        }
    }

    public function test_connection_failure_is_sanitized_and_malformed_success_is_not_treated_as_safe(): void
    {
        foreach ([Http::failedConnection('Sensitive exception'), Http::response(['results' => [['flagged' => false]]])] as $response) {
            Http::swap(new Factory);
            Http::preventStrayRequests();
            Http::fake(['api.openai.com/v1/moderations' => $response]);
            try {
                app(OpenAiModeration::class)->analyze('Texto');
                $this->fail('Expected failure');
            } catch (ModerationUnavailable $error) {
                $this->assertStringNotContainsString('Sensitive', $error->getMessage());
                $this->assertNull($error->getPrevious());
            }
        }
    }

    public function test_stale_jobs_cannot_override_a_new_analysis_or_read_deleted_reports(): void
    {
        $report = $this->report();
        $oldJob = $this->enqueue($report);
        $oldJob->failed(null);
        $newJob = $this->enqueue($report->fresh());
        $oldJob->handle(app(OpenAiModeration::class));
        $oldJob->failed(null);
        $this->assertSame('pending', $report->fresh()->moderation_status);
        $this->assertSame($newJob->token, $report->fresh()->moderation_token);
        $report->delete();
        $newJob->handle(app(OpenAiModeration::class));
        Http::assertNothingSent();
    }

    public function test_queue_failure_never_loses_the_report(): void
    {
        Queue::shouldReceive('push')->andThrow(new \RuntimeException('Queue down'));
        $report = $this->report();
        app(ReportModeration::class)->enqueue($report);
        $this->assertSame('failed', $report->fresh()->moderation_status);
        $this->assertSame('pending', $report->fresh()->status);
        Http::assertNothingSent();
    }

    public function test_disabling_the_service_before_a_queued_job_runs_keeps_manual_review_available(): void
    {
        $report = $this->report();
        $job = $this->enqueue($report);
        config(['services.openai.moderation_enabled' => false]);
        $job->handle(app(OpenAiModeration::class));
        $this->assertSame('unavailable', $report->fresh()->moderation_status);
        $this->assertSame('pending', $report->fresh()->status);
        Http::assertNothingSent();
    }

    public function test_only_admins_can_request_analysis_and_read_results(): void
    {
        $report = $this->report();
        $this->post(route('admin.reports.moderate', $report))->assertRedirect(route('login'));
        $this->actingAs(User::findOrFail($report->fk_user_id))->post(route('admin.reports.moderate', $report))->assertRedirect(route('dashboard'));
        Queue::assertNothingPushed();
        $this->actingAs(User::factory()->create(['is_admin' => true, 'first_login' => false]));
        $this->post(route('admin.reports.moderate', $report))->assertSessionHasNoErrors();
        $this->post(route('admin.reports.moderate', $report))->assertSessionHasNoErrors();
        Queue::assertPushed(ModerateReport::class, 1);
        $this->get(route('admin.reports.index'))->assertInertia(fn (Assert $page) => $page
            ->where('reports.data.0.moderation.status', 'pending')->missing('reports.data.0.moderation_token')->missing('services.openai.key'));
    }
}
