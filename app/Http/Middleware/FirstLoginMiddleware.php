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

     if(auth()->user()->first_login && !$request->routeIs('admin.first-login') && !$request->routeIs('admin.credentials.update')){
                return redirect()->route('admin.first-login');
            }

        return $next($request);
    }
}
