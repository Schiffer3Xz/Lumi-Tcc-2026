<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
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
        
        return $next($request);
    }
}
