<?php

namespace App\Services\Moderation;

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

    public function validate(?string $text): void
    {
        if (config('moderation.enabled') !== true || $text === null) {
            return;
        }

        $violation = $this->policy->violation(strtolower($text));

        if ($violation) {
            throw ValidationException::withMessages(['content' => $violation]);
        }
    }

    public function validateProfile(): void
    {
        // Profile text currently has no moderation rules.
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

        $analysis = $this->openAiModeration->analyze([
            ['type' => 'image_url', 'image_url' => ['url' => $imageDataUrl]],
        ]);
        $scores = $analysis['result']['category_scores'];

        foreach ($limits as $category => [$configKey, $default]) {
            $threshold = config("moderation.{$configKey}", $default);
            if (($scores[$category] ?? 0) >= $threshold) {
                throw ValidationException::withMessages([$field => "Imagem não permitida: {$category}"]);
            }
        }

        $extremistAnalysis = $this->openAiModeration->analyzeExtremistContent($imageDataUrl);
        if ($extremistAnalysis['promotes_nazism'] && $extremistAnalysis['confidence'] >= 0.85) {
            throw ValidationException::withMessages([$field => 'Imagem não permitida: apologia ao nazismo.']);
        }
    }
}
