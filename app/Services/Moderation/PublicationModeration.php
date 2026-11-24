<?php

namespace App\Services\Moderation;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class PublicationModeration
{
    protected ContentPolicy $policy;

    protected OpenAiModeration $openAiModeration;

    public function __construct()
    {
        $this->policy = new ContentPolicy();
        $this->openAiModeration = new OpenAiModeration();
    }

    public function validate(?string $text, string $field = 'content', string $context = 'post'): void
    {
        if (config('moderation.enabled') !== true || blank($text)) {
            return;
        }

        $this->validateLocally($text, $field, $context);

        try {
            $analysis = $this->openAiModeration->analyze($this->policy->analysisText($text));
        } catch (ModerationUnavailable $exception) {
            throw ValidationException::withMessages([$field => $exception->getMessage()]);
        }

        if ($analysis['result']['flagged']) {
            $message = 'Texto não permitido pela moderação.';
            throw ValidationException::withMessages([$field => $message, 'moderation' => $message]);
        }
    }

    public function validateLocally(?string $text, string $field = 'content', string $context = 'post'): void
    {
        if (config('moderation.enabled') !== true || blank($text)) {
            return;
        }

        if ($violation = $this->policy->violation($text, $context)) {
            throw ValidationException::withMessages([$field => $violation, 'moderation' => $violation]);
        }
    }

    public function validateProfile(array $fields, ?User $user = null): void
    {
        foreach (['name', 'nickname', 'description'] as $field) {
            if (array_key_exists($field, $fields) && $fields[$field] !== $user?->{$field}) {
                $this->validateLocally($fields[$field], $field, $field);
            }
        }
    }

    public function validateImage(?UploadedFile $image, string $field = 'image'): void
    {
        $this->moderateImage($image, $field);
    }

    public function moderateImage(?UploadedFile $image, string $field = 'image'): void
    {
        if (config('moderation.enabled') !== true || $image === null) {
            return;
        }

        $base64 = base64_encode(file_get_contents($image->getRealPath()));
        $mimeType = $image->getMimeType();
        $imageDataUrl = "data:{$mimeType};base64,{$base64}";
        $limits = [
            'sexual' => ['image_sexual_threshold', 0.05],
            'violence' => ['image_violence_threshold', 0.02],
            'violence/graphic' => ['image_graphic_violence_threshold', 0.05],
        ];

        try {
            $analysis = $this->openAiModeration->analyze([
                ['type' => 'image_url', 'image_url' => ['url' => $imageDataUrl]],
            ]);
        } catch (ModerationUnavailable $exception) {
            throw ValidationException::withMessages([$field => $exception->getMessage()]);
        }

        $scores = $analysis['result']['category_scores'];
        if (array_diff_key($limits, $scores) !== []) {
            throw ValidationException::withMessages([$field => 'Resposta de moderação de imagem incompleta.']);
        }

        foreach ($limits as $category => [$configKey, $default]) {
            $threshold = config("moderation.{$configKey}", config("services.openai.{$configKey}", $default));
            if ($scores[$category] >= $threshold) {
                $message = "Imagem não permitida: {$category}";
                throw ValidationException::withMessages([$field => $message, 'moderation' => $message]);
            }
        }

        $categories = $analysis['result']['categories'];
        foreach (['self-harm', 'self-harm/intent', 'self-harm/instructions'] as $category) {
            if ($categories[$category] ?? false) {
                $message = "Imagem não permitida: {$category}";
                throw ValidationException::withMessages([$field => $message, 'moderation' => $message]);
            }
        }

        if (config('moderation.extremist_image_analysis_enabled') !== true) {
            return;
        }

        try {
            $extremistAnalysis = $this->openAiModeration->analyzeExtremistContent($imageDataUrl);
        } catch (ModerationUnavailable $exception) {
            throw ValidationException::withMessages([$field => $exception->getMessage()]);
        }
        if ($extremistAnalysis['promotes_nazism'] && $extremistAnalysis['confidence'] >= 0.85) {
            throw ValidationException::withMessages([$field => 'Imagem não permitida: apologia ao nazismo.']);
        }
    }
}
