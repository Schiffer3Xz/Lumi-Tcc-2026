<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FirstLoginMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user = $request->user();

        if ($user->first_login && ! $request->routeIs('admin.first-login') && ! $request->routeIs('admin.credentials.update')) {
            return redirect()->route('admin.first-login');
        }

        if ($user->is_admin && is_null($user->email_verified_at)
            && ! $request->routeIs('admin.email-verification')
            && ! $request->routeIs('admin.email.verify')
            && ! $request->routeIs('admin.email.resend')
            && ! $request->routeIs('logout')) {
            return redirect()->route('verification.notice');
        }

        return $next($request);
    }
}
