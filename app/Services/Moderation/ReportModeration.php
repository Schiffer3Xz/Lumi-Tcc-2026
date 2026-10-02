<?php

namespace App\Services\Moderation;

use App\Jobs\ModerateReport;
use App\Models\Report;
use Illuminate\Support\Str;
use Throwable;

class ReportModeration
{
    public function __construct(private OpenAiModeration $moderation) {}

    public function enqueue(Report $report): void
    {
        $text = $report->target_snapshot['content'] ?? null;
        $status = ! is_string($text) || trim($text) === '' ? 'unsupported' : ($this->moderation->available() ? 'pending' : 'unavailable');
        $token = (string) Str::uuid();

        // An atomic claim prevents repeated admin clicks from scheduling duplicate work.
        $claimed = Report::whereKey($report->id)->where('moderation_status', '!=', 'pending')->update([
            'moderation_status' => $status, 'moderation_token' => $token,
            'moderation_result' => null, 'moderation_model' => null, 'moderated_at' => null,
        ]);
        if (! $claimed || $status !== 'pending') {
            return;
        }

        try {
            ModerateReport::dispatch($report->id, $token)->afterCommit();
        } catch (Throwable) {
            Report::whereKey($report->id)->where('moderation_token', $token)->where('moderation_status', 'pending')
                ->update(['moderation_status' => 'failed']);
        }
    }
}
