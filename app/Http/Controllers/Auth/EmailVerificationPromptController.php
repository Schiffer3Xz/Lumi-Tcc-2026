<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->is_admin) {
            if ($request->user()->first_login) {
                return redirect()->route('admin.first-login');
            }

            return $request->user()->hasVerifiedEmail()
                ? redirect()->route('admin.dashboard')
                : Inertia::render('admin/settings/verify-email', ['status' => $request->session()->get('status')]);
        }

        return $request->user()->hasVerifiedEmail()
                    ? redirect()->intended(route('dashboard', absolute: false))
                    : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
