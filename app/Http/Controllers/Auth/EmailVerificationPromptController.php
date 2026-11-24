<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /** Show the email verification prompt for administrators. */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->is_admin) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        if ($user->first_login) {
            return redirect()->route('admin.first-login');
        }

        return ! is_null($user->email_verified_at)
            ? redirect()->route('admin.dashboard')
            : Inertia::render('admin/settings/verify-email', ['status' => $request->session()->get('status')]);
    }
}
