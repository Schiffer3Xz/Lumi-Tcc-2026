<?php

namespace App\Services\Moderation;

use Illuminate\Validation\ValidationException;

class PublicationModeration
{
    public function __construct(private OpenAiModeration $moderation) {}

    public function validate(?string $text, string $field = 'content', string $context = 'post'): void
    {
        if (blank($text)) {
            return;
        }

        $policy = app(ContentPolicy::class);
        if ($message = $policy->violation($text, $context)) {
            throw ValidationException::withMessages([$field => $message, 'moderation' => $message]);
        }
        if (! config('services.openai.moderation_enabled')) {
            return;
        }

        try {
            $analysis = $this->moderation->analyze($policy->analysisText($text));
        } catch (ModerationUnavailable) {
            throw ValidationException::withMessages([
                $field => 'Não foi possível analisar o texto agora. As alterações não foram salvas. Mantenha o texto e tente novamente em instantes.',
            ]);
        }

        if ($analysis['result']['flagged']) {
            throw ValidationException::withMessages([
                $field => 'Este texto foi sinalizado por possível assédio, discriminação ou conteúdo prejudicial. Revise o texto e tente novamente.',
                'moderation' => 'Nossa equipe identificou possível conteúdo ofensivo ou inadequado. A publicação foi bloqueada.',
            ]);
        }
    }

    public function validateProfile(array $data, ?\App\Models\User $user = null): void
    {
        foreach (['name', 'nickname', 'description'] as $field) {
            if (array_key_exists($field, $data) && (! $user || $data[$field] !== $user->{$field})) {
                $this->validate($data[$field], $field, $field);
            }
        }
    }
}
