<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\VerificationEmailSender;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request, VerificationEmailSender $verificationEmail): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        if (! $verificationEmail->send($request->user())) {
            return back()->withErrors(['verification' => VerificationEmailSender::ERROR_MESSAGE]);
        }

        return back()->with('status', 'verification-link-sent');
    }
}
