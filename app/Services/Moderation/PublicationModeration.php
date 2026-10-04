<?php

namespace App\Services\Moderation;

use Illuminate\Validation\ValidationException;

class PublicationModeration
{
    public function __construct(private OpenAiModeration $moderation) {}

    public function validate(?string $text): void
    {
        if (blank($text) || ! config('services.openai.moderation_enabled')) {
            return;
        }

        try {
            $analysis = $this->moderation->analyze($text);
        } catch (ModerationUnavailable) {
            throw ValidationException::withMessages([
                'content' => 'Não foi possível analisar o texto agora. Sua publicação não foi salva. Tente novamente em instantes.',
            ]);
        }

        if ($analysis['result']['flagged']) {
            throw ValidationException::withMessages([
                'content' => 'Este texto foi sinalizado pela moderação. Revise possíveis ofensas ou conteúdo prejudicial antes de publicar na rede social.',
                'moderation' => 'Nossa equipe identificou possível conteúdo ofensivo ou inadequado. A publicação foi bloqueada.',
            ]);
        }
    }
}
