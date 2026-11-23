<?php

return [

    'library_notices' => [
        'manager_ids' => array_filter(array_map('trim', explode(',', (string) env('LIBRARY_NOTICE_MANAGER_IDS', '')))),
    ],

    'google_books' => [
        'key' => env('GOOGLE_BOOKS_API_KEY'),
    ],

    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-3.5-flash-lite'),
    ],

    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'moderation_model' => 'omni-moderation-latest',
        'image_sexual_threshold' => (float) env('OPENAI_IMAGE_SEXUAL_THRESHOLD', 0.05),
    ],

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
