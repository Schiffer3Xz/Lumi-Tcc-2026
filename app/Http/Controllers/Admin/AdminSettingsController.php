<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\VerificationEmailSender;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class AdminSettingsController extends Controller
{
    public function index()
    {
        return view('admin/settings/index');
    }

    public function create()
    {
        return view('admin/settings/updateCredentials');
    }

    public function firstLogin()
    {
        return view('admin/settings/firstLoginSetup');
    }

    public function emailVerification()
    {
        return redirect()->route('verification.notice');
    }

    public function verifyEmail(Request $request, int $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        abort_unless($request->user()->id === $user->id, 403);

        abort_unless(hash_equals(sha1($user->email), (string) $request->route('hash')), 403);

        if (is_null($user->email_verified_at)) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        return redirect()->route('admin.dashboard')->with('success', 'E-mail verificado com sucesso.');
    }

    public function resendVerification(Request $request): RedirectResponse
    {
        $sent = $this->sendVerificationEmail($request->user());

        return $sent
            ? back()->with('status', 'verification-link-sent')
            : back()->withErrors(['verification' => 'Não foi possível enviar o e-mail de verificação.']);
    }

    public function editEmail()
    {
        return view('admin/settings/editEmail');
    }

    public function editPassword()
    {
        return view('admin/settings/editPassword');
    }

    public function adminView()
    {
        return view('admin/settings/createAdmin');
    }

    public function adminCount()
    {
        $admins = User::where('is_admin', true)->get();
        $totalAdmins = User::where('is_admin', true)->count();

        return view('admin/settings/countAdmin', compact('totalAdmins', 'admins'));
    }

    // Update do first Access

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255|unique:users,nickname,'.auth()->id(),
            'email' => 'nullable|email|max:255|unique:users,email,'.auth()->id(),
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        $user->name = $request->name;
        $user->nickname = $request->nickname;
        $user->email = $request->filled('email') ? $request->email : $user->email;
        $user->password = Hash::make($request->password);
        $user->first_login = false;
        $user->email_verified_at = null;

        $user->save();

        $sent = app(VerificationEmailSender::class)->send($user);
        $response = redirect()->route('verification.notice');

        return $sent
            ? $response->with('status', 'verification-link-sent')
            : $response->withErrors(['verification' => VerificationEmailSender::ERROR_MESSAGE]);
    }

    // Update do Perfil ja logado
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255|unique:users,nickname,'.auth()->id(),
            'description' => 'required|string|max:255',
        ]);

        $user = auth()->user();

        $user->name = $request->name;
        $user->nickname = $request->nickname;
        $user->description = $request->description;

        $user->save();

        return redirect()->route('admin.dashboard');
    }

    public function updateEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255|unique:users,email,'.auth()->id(),
            'current_password' => 'required|current_password',
        ]);

        $user = auth()->user();
        $user->email = $request->email;
        $user->email_verified_at = null;

        $user->save();

        $sent = $this->sendVerificationEmail($user);
        $response = redirect()->route('admin.email-verification');

        return $sent
            ? $response->with('status', 'verification-link-sent')
            : $response->withErrors(['verification' => 'Não foi possível enviar o e-mail de verificação.']);
    }

    private function sendVerificationEmail(User $user): bool
    {
        $verificationUrl = URL::temporarySignedRoute(
            'admin.email.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)],
        );

        try {
            Mail::raw(
                "Olá, {$user->name}!\n\nConfirme seu e-mail acessando o link abaixo:\n{$verificationUrl}\n\nEste link expira em 60 minutos.",
                function ($message) use ($user) {
                    $message->to($user->email)->subject('Verifique seu e-mail');
                },
            );
        } catch (TransportExceptionInterface $exception) {
            report($exception);

            return false;
        }

        return true;
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();
        $user->password = Hash::make($request->password);

        $user->save();

        return redirect()->route('admin.dashboard');
    }

    public function createAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255|unique:users,nickname,',
            'email' => 'required|email|max:255|unique:users,email,'.auth()->id(),
            'password' => 'required|string|min:8|',
        ]);

        User::create([
            'name' => $request->name,
            'nickname' => $request->nickname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => true,
            'first_login' => true,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Administrador cadastrado com sucesso!');
    }
}
