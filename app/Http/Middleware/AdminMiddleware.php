<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return $next($request);
        }

        if(auth()->user()->is_admin){
            if (!$request->is('admin*')) {
                return redirect()->route('admin.dashboard');
            }
            
        }else{
            if ($request->is('admin*')) {
                return redirect()->route('dashboard');
            }
        }

        if(auth()->user()->first_login && !$request->routeIs('admin.first-login') && !$request->routeIs('admin.credentials.update')){
                return redirect()->route('admin.first-login');
            }

    return $next($request);
    }
}

