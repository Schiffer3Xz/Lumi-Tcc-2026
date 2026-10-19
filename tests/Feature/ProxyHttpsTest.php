<?php

namespace Tests\Feature;

use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Tests\TestCase;

class ProxyHttpsTest extends TestCase
{
    public function test_trusted_proxy_generates_https_asset_urls(): void
    {
        config(['trustedproxy.proxies' => '*']);
        $request = Request::create('http://lumi.example/', server: [
            'REMOTE_ADDR' => '10.0.0.1',
            'HTTP_X_FORWARDED_PROTO' => 'https',
            'HTTP_X_FORWARDED_PORT' => '443',
        ]);

        try {
            (new TrustProxies)->handle($request, function ($request) {
                $urls = new \Illuminate\Routing\UrlGenerator(app('router')->getRoutes(), $request);
                $this->assertTrue($request->isSecure());
                $this->assertSame('https://lumi.example/build/assets/app.js', $urls->asset('build/assets/app.js'));

                return response('OK');
            });
        } finally {
            Request::setTrustedProxies([], 0);
        }
    }
}
