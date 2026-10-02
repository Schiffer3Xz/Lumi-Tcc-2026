<?php

namespace App\Services\Moderation;

use RuntimeException;

class ModerationUnavailable extends RuntimeException
{
    // Never include request contents, response bodies or credentials in this exception.
}
