<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function publication(): Post
    {
        return Post::create(['fk_user_id' => User::factory()->create(['name' => 'Autor da publicação'])->id, 'content' => 'Texto original']);
    }

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true, 'first_login' => false]);
    }

    public function test_reader_submits_a_report_and_cannot_spoof_identity_or_review(): void
    {
        $reader = User::factory()->create();
        $post = $this->publication();
        $this->actingAs($reader)->from(route('list'))->post(route('posts.report', $post), [
            'content' => 'Conteúdo ofensivo', 'fk_user_id' => $post->fk_user_id,
            'status' => 'reviewed', 'reviewed_by' => $post->fk_user_id,
        ])->assertRedirect(route('list'))->assertSessionHasNoErrors();
        $report = Report::firstOrFail();
        $this->assertSame($reader->id, $report->fk_user_id);
        $this->assertSame($post->id, $report->fk_post_id);
        $this->assertNull($report->fk_comment_id);
        $this->assertSame('pending', $report->status);
        $this->assertNull($report->reviewed_by);
        $this->assertSame('Texto original', $report->target_snapshot['content']);
        $this->assertDatabaseCount('post_saves', 0);
        $this->post(route('posts.report', $post), ['content' => 'Tentativa repetida'])->assertSessionHasNoErrors();
        $this->assertDatabaseCount('reports', 1);
    }

    public function test_reporting_requires_login_existing_post_and_valid_reason(): void
    {
        $post = $this->publication();
        $this->post(route('posts.report', $post), ['content' => 'Motivo'])->assertRedirect(route('login'));
        $this->actingAs(User::factory()->create());
        foreach (['', str_repeat('a', 256)] as $content) {
            $this->post(route('posts.report', $post), compact('content'))->assertSessionHasErrors('content');
        }
        $this->post(route('posts.report', 99999), ['content' => 'Motivo'])->assertNotFound();
        $this->assertDatabaseCount('reports', 0);
    }

    public function test_only_admins_can_read_or_review_reports(): void
    {
        $post = $this->publication();
        $reader = User::factory()->create();
        $report = Report::create(['fk_user_id' => $reader->id, 'fk_post_id' => $post->id, 'content' => 'Motivo']);
        $this->get(route('admin.reports.index'))->assertInertia(fn (Assert $page) => $page->component('auth/required'));
        $this->patch(route('admin.reports.update', $report), ['status' => 'reviewed'])->assertRedirect(route('login'));
        $this->actingAs($reader)->get(route('admin.reports.index'))->assertRedirect(route('dashboard'));
        $this->patch(route('admin.reports.update', $report), ['status' => 'reviewed'])->assertRedirect(route('dashboard'));
        $this->assertSame('pending', $report->fresh()->status);
    }

    public function test_admin_filters_paginates_and_records_review(): void
    {
        $post = $this->publication();
        $reader = User::factory()->create(['name' => 'Leitora da comunidade']);
        foreach (range(1, 17) as $number) {
            Report::create(['fk_user_id' => $reader->id, 'fk_post_id' => $post->id, 'content' => "Relato $number"]);
        }
        $report = Report::latest('id')->firstOrFail();
        $admin = $this->admin();
        $this->actingAs($admin)->get(route('admin.reports.index'))->assertInertia(fn (Assert $page) => $page
            ->component('admin/reports/index')->has('reports.data', 15)->where('reports.total', 17)
            ->where('counts.pending', 17)->where('reports.data.0.reporter', 'Leitora da comunidade')
            ->missing('reports.data.0.reporter.email'));
        $this->get(route('admin.reports.index', ['page' => 2]))->assertInertia(fn (Assert $page) => $page->has('reports.data', 2));
        $this->get(route('admin.reports.index', ['q' => 'Relato 17']))->assertInertia(fn (Assert $page) => $page->where('reports.total', 1));
        $this->get(route('admin.reports.index', ['q' => 'Leitora']))->assertInertia(fn (Assert $page) => $page->where('reports.total', 17));

        $this->from(route('admin.reports.index'))->patch(route('admin.reports.update', $report), [
            'status' => 'reviewed', 'review_note' => 'Analisado pela equipe.', 'reviewed_by' => $reader->id,
        ])->assertRedirect(route('admin.reports.index'))->assertSessionHasNoErrors();
        $report->refresh();
        $this->assertSame('reviewed', $report->status);
        $this->assertSame($admin->id, $report->reviewed_by);
        $this->assertNotNull($report->reviewed_at);
        $this->assertSame('Analisado pela equipe.', $report->review_note);
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
        $this->get(route('admin.reports.index', ['status' => 'reviewed']))->assertInertia(fn (Assert $page) => $page
            ->where('reports.total', 1)->where('counts.pending', 16)->where('counts.reviewed', 1));
        foreach (['dismissed', 'pending'] as $status) {
            $this->patch(route('admin.reports.update', $report), compact('status'))->assertSessionHasNoErrors();
            $this->assertSame($status, $report->fresh()->status);
        }
    }

    public function test_review_validation_preserves_the_existing_decision(): void
    {
        $post = $this->publication();
        $report = Report::create(['fk_user_id' => $post->fk_user_id, 'fk_post_id' => $post->id, 'content' => 'Motivo']);
        $this->actingAs($this->admin())->patch(route('admin.reports.update', $report), [
            'status' => 'invalid', 'review_note' => str_repeat('a', 2001),
        ])->assertSessionHasErrors(['status', 'review_note']);
        $this->assertSame('pending', $report->fresh()->status);
        $this->assertNull($report->fresh()->reviewed_at);
    }

    public function test_report_keeps_original_content_after_post_edit_and_deletion(): void
    {
        $post = $this->publication();
        $reader = User::factory()->create();
        $this->actingAs($reader)->post(route('posts.report', $post), ['content' => 'Motivo']);
        $report = Report::firstOrFail();
        $post->update(['content' => 'Texto editado']);
        $this->actingAs($this->admin())->get(route('admin.reports.index'))->assertInertia(fn (Assert $page) => $page
            ->where('reports.data.0.target.content', 'Texto original')->where('reports.data.0.target.deleted', false));
        $this->actingAs(User::findOrFail($post->fk_user_id))->delete(route('posts.destroy', $post->id))->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        $this->assertNull($report->fresh()->fk_post_id);
        $reader->delete();
        $this->assertNull($report->fresh()->fk_user_id);
        $this->actingAs($this->admin())->get(route('admin.reports.index'))->assertInertia(fn (Assert $page) => $page
            ->where('reports.data.0.target.content', 'Texto original')->where('reports.data.0.target.deleted', true)
            ->where('reports.data.0.reporter', 'Conta removida'));
    }
}
