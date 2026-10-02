<?php

namespace App\Jobs;

use App\Models\Report;
use App\Services\Moderation\ModerationUnavailable;
use App\Services\Moderation\OpenAiModeration;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class ModerateReport implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 20;

    // The queued payload contains only identifiers, never content or personal data.
    public function __construct(public int $reportId, public string $token) {}

    public function backoff(): array
    {
        return [60, 180];
    }

    public function handle(OpenAiModeration $moderation): void
    {
        $report = Report::whereKey($this->reportId)->where('moderation_token', $this->token)
            ->where('moderation_status', 'pending')->first();
        if (! $report) {
            return;
        }
        if (! $moderation->available()) {
            $this->update(['moderation_status' => 'unavailable']);

            return;
        }
        $text = $report->target_snapshot['content'] ?? null;
        if (! is_string($text) || trim($text) === '') {
            $this->update(['moderation_status' => 'unsupported']);

            return;
        }
        try {
            $analysis = $moderation->analyze($text);
        } catch (ModerationUnavailable) {
            // Reset the exception trace here so failed jobs cannot include the text argument.
            throw new ModerationUnavailable('Não foi possível concluir a moderação.');
        }
        $this->update([
            'moderation_status' => 'completed', 'moderation_result' => json_encode($analysis['result'], JSON_THROW_ON_ERROR),
            'moderation_model' => $analysis['model'], 'moderated_at' => now(),
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        $this->update(['moderation_status' => 'failed']);
    }

    private function update(array $values): void
    {
        Report::whereKey($this->reportId)->where('moderation_token', $this->token)
            ->where('moderation_status', 'pending')->update($values);
    }
}
