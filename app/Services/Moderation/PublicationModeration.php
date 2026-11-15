<?php

namespace App\Services\Moderation;

use Illuminate\Validation\ValidationException;
use Illuminate\Http\UploadedFile;

class PublicationModeration
{
    public function __construct(private OpenAiModeration $moderation) {}

    public function validateImage(UploadedFile $image, string $field = 'image'): void
    {
        $bytes = $image->get();
        if (($image->getMimeType() === 'image/png' && str_contains($bytes, 'acTL'))
            || ($image->getMimeType() === 'image/webp' && str_contains($bytes, 'ANIM'))) {
            throw ValidationException::withMessages([$field => 'Envie uma imagem estática em JPG, PNG ou WebP. Animações não são permitidas.']);
        }
        try {
            $analysis = $this->moderation->analyze([
                ['type' => 'image_url', 'image_url' => [
                    'url' => 'data:'.$image->getMimeType().';base64,'.base64_encode($bytes),
                ]],
            ]);
            // A partial text-only response must never approve an image.
            if (! array_key_exists('sexual', $analysis['result']['categories'])) {
                throw new ModerationUnavailable('Classificação de imagem ausente.');
            }
        } catch (ModerationUnavailable) {
            throw ValidationException::withMessages([
                $field => 'Não foi possível analisar a imagem agora. As alterações não foram salvas. Tente novamente em instantes.',
            ]);
        }

        // Apply the community's stricter image policy even when the provider's
        // default classification does not flag suggestive content.
        $threshold = (float) config('services.openai.image_sexual_threshold', 0.05);
        if (! is_finite($threshold) || $threshold <= 0 || $threshold > 1) {
            $threshold = 0.05;
        }
        $sexualScore = $analysis['result']['category_scores']['sexual'];
        if ($analysis['result']['flagged'] || $analysis['result']['categories']['sexual'] || $sexualScore >= $threshold) {
            throw ValidationException::withMessages([
                $field => 'Imagem bloqueada por possível nudez, conteúdo sexual ou sugestivo, inclusive em desenhos e anime. Escolha outra imagem.',
                'moderation' => 'A imagem foi sinalizada como inadequada. A publicação foi bloqueada.',
            ]);
        }
    }

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
