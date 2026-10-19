<?php

use Illuminate\Http\Request;

return [
    // Railway terminates HTTPS before forwarding requests to Laravel.
    // Railway is identified by its injected environment ID. Other proxies
    // can be configured explicitly using TRUSTED_PROXIES (IPs or '*').
    'proxies' => env('TRUSTED_PROXIES', env('RAILWAY_ENVIRONMENT_ID') ? '*' : null),
    'headers' => Request::HEADER_X_FORWARDED_FOR
        | Request::HEADER_X_FORWARDED_PORT
        | Request::HEADER_X_FORWARDED_PROTO,
];
