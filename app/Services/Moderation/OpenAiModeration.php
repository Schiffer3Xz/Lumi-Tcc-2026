<?php

namespace App\Services\Moderation;

use Illuminate\Support\Facades\Http;
use Throwable;

class OpenAiModeration
{
    public function available(): bool
    {
        return (bool) config('services.openai.moderation_enabled') && filled(config('services.openai.key'));
    }

    public function analyze(string $text): array
    {
        if (! $this->available()) {
            throw new ModerationUnavailable('Moderação indisponível.');
        }

        try {
            $response = Http::withToken(config('services.openai.key'))
                ->acceptJson()->asJson()->connectTimeout(3)->timeout(12)
                ->withOptions(['allow_redirects' => false])
                ->post('https://api.openai.com/v1/moderations', [
                    'model' => config('services.openai.moderation_model'),
                    'input' => $text,
                ]);
        } catch (Throwable) {
            throw new ModerationUnavailable('Não foi possível conectar à moderação.');
        }

        if (! $response->successful()) {
            throw new ModerationUnavailable('Serviço de moderação indisponível.');
        }

        $result = $response->json('results.0');
        $model = $response->json('model');
        if (! is_array($result) || ! is_bool($result['flagged'] ?? null)
            || ! is_array($result['categories'] ?? null) || empty($result['categories'])
            || ! is_array($result['category_scores'] ?? null)
            || ! is_string($model) || strlen($model) > 255) {
            throw new ModerationUnavailable('Resposta de moderação inválida.');
        }

        $categories = [];
        $scores = [];
        foreach ($result['categories'] as $category => $flag) {
            $score = $result['category_scores'][$category] ?? null;
            if (! is_string($category) || ! preg_match('/^[a-z][a-z\/-]{0,60}$/', $category)
                || ! is_bool($flag) || ! is_numeric($score) || ! is_finite((float) $score) || $score < 0 || $score > 1) {
                throw new ModerationUnavailable('Classificação de moderação inválida.');
            }
            $categories[$category] = $flag;
            $scores[$category] = (float) $score;
        }

        return ['model' => $model, 'result' => ['flagged' => $result['flagged'], 'categories' => $categories, 'category_scores' => $scores]];
    }
}
