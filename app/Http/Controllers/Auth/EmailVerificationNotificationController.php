<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\VerificationEmailSender;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /** Keep regular users outside the administrator-only verification flow. */
    public function store(Request $request, VerificationEmailSender $sender): RedirectResponse
    {
        $user = $request->user();
        if (! $user->is_admin) {
            return redirect()->route('dashboard');
        }

        if ($user->first_login) {
            return redirect()->route('admin.first-login');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('admin.dashboard');
        }

        $sent = $sender->send($user);
        $response = redirect()->route('verification.notice');

        return $sent
            ? $response->with('status', 'verification-link-sent')
            : $response->withErrors(['verification' => VerificationEmailSender::ERROR_MESSAGE]);
    }
}
