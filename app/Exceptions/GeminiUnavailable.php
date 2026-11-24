<?php

namespace App\Exceptions;

use RuntimeException;

final class GeminiUnavailable extends RuntimeException
{
    public function __construct(
        public readonly ?int $providerStatus = null,
        public readonly ?string $failureType = null,
    ) {
        parent::__construct('Gemini is temporarily unavailable.');
    }
}
