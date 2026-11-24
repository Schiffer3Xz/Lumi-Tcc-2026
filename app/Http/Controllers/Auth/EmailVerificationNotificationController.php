<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /** Keep regular users outside the administrator-only verification flow. */
    public function store(Request $request): RedirectResponse
    {
        if (! $request->user()->is_admin) {
            return redirect()->route('dashboard');
        }

        return redirect()->route('admin.email-verification');
    }
}
