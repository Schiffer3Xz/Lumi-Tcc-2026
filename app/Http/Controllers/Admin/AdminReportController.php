<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\Moderation\ReportModeration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->is_admin, 403);
        $request->validate([
            'status' => ['sometimes', Rule::in(['all', ...Report::STATUSES])],
            'q' => ['nullable', 'string', 'max:120'],
        ]);
        $status = $request->input('status', 'pending');
        $search = trim((string) $request->input('q', ''));
        $query = Report::with(['reporter:id,name', 'reviewer:id,name', 'post.user:id,name', 'comment.user:id,name'])
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('content', 'like', '%'.$search.'%')
                    ->orWhereHas('reporter', fn ($user) => $user->where('name', 'like', '%'.$search.'%'));
            }));
        $reports = $query->latest('id')->paginate(15)->withQueryString()->through(function (Report $report) {
            $target = $report->comment ?? $report->post;
            $snapshot = $report->target_snapshot;
            $image = $snapshot['image'] ?? $report->post?->media_url;

            return [
                'id' => $report->id, 'content' => $report->content, 'status' => $report->status,
                'created_at' => $report->created_at?->toIso8601String(),
                'reporter' => $report->reporter?->name ?? 'Conta removida',
                'reviewer' => $report->reviewer?->name,
                'review_note' => $report->review_note,
                'reviewed_at' => $report->reviewed_at?->toIso8601String(),
                'moderation' => [
                    'status' => $report->moderation_status,
                    'result' => $report->moderation_result,
                    'analyzed_at' => $report->moderated_at?->toIso8601String(),
                ],
                'target' => [
                    'type' => $snapshot['type'] ?? ($report->fk_comment_id ? 'comment' : 'post'),
                    'author' => $snapshot['author'] ?? $target?->user?->name ?? 'Conta removida',
                    'content' => $snapshot['content'] ?? $target?->content,
                    'image' => $image ? (str_starts_with($image, 'http') ? $image : asset('storage/'.$image)) : null,
                    'deleted' => $target === null,
                ],
            ];
        });
        $counts = Report::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

        return Inertia::render('admin/reports/index', [
            'reports' => $reports,
            'filters' => ['status' => $status, 'q' => $search],
            'counts' => collect(Report::STATUSES)->mapWithKeys(fn ($value) => [$value => (int) ($counts[$value] ?? 0)]),
        ]);
    }

    public function update(Request $request, Report $report): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $validated = $request->validate([
            'status' => ['required', Rule::in(Report::STATUSES)],
            'review_note' => ['nullable', 'string', 'max:2000'],
        ]);
        $report->update([
            'status' => $validated['status'],
            'review_note' => $validated['review_note'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Análise da denúncia atualizada.');
    }

    public function moderate(Request $request, Report $report, ReportModeration $moderation): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);
        $moderation->enqueue($report);

        return back()->with('success', 'Solicitação registrada. Consulte a análise automática no painel.');
    }
}
