<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Services\VerificationEmailSender;

use Illuminate\Http\Request;

    class AdminSettingsController extends Controller
{
    public function index(){
        return view('admin/settings/index');
    }

    public function create(){
        return view('admin/settings/updateCredentials');
    }

    public function firstLogin(){
        return view('admin/settings/firstLoginSetup');
    }

    public function emailVerification(){
        return redirect()->route('verification.notice');
    }

    public function editEmail(){
        return view('admin/settings/editEmail');
    }

    public function editPassword(){
        return view('admin/settings/editPassword');
    }

    public function adminView(){
        return view('admin/settings/createAdmin');
    }

    public function adminCount(){
        $admins = User::where('is_admin', true)->get();
        $totalAdmins = User::where('is_admin', true)->count();
        return view('admin/settings/countAdmin', compact('totalAdmins', 'admins'));
    }


    //Update do first Access
    public function update(Request $request, VerificationEmailSender $verificationEmail){
        if (! $request->filled('email')) {
            $request->merge(['email' => $request->user()->email]);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255|unique:users,nickname,' . auth()->id(),
            'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        $emailAlterado = $user->email !== $request->email;
        $firstLogin = $user->first_login == true;

        $user->name = $request->name;
        $user->nickname = $request->nickname;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->first_login = false;

        if ($emailAlterado) {
            $user->email_verified_at = null;
        }

        $user->save();

        if (($firstLogin || $emailAlterado) && ! $user->hasVerifiedEmail()) {
            $sent = $verificationEmail->send($user);
            $response = redirect()->route('verification.notice')
                ->with('success', 'Dados salvos. Confirme seu e-mail para acessar o painel.');

            return $sent
                ? $response->with('status', 'verification-link-sent')
                : $response->withErrors(['verification' => VerificationEmailSender::ERROR_MESSAGE]);
        }

        return redirect()->route('admin.dashboard');
    }


    //Update do Perfil ja logado
    public function updateProfile(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255|unique:users,nickname,' . auth()->id(),
            'description' => 'required|string|max:255',
        ]);

         $user = auth()->user();

        $user->name = $request->name;
        $user->nickname = $request->nickname;
        $user->description = $request->description;

        $user->save();

        return redirect()->route('admin.dashboard');
    }

    public function updateEmail(Request $request, VerificationEmailSender $verificationEmail){
         $request->validate([
            'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
            'current_password' => 'required|current_password',
        ]);

        $user = auth()->user();
        $user->email = $request->email;
        $user->email_verified_at = null;
        
        $user->save();

        $sent = $verificationEmail->send($user);
        $response = redirect()->route('verification.notice');

        return $sent
            ? $response->with('status', 'verification-link-sent')
            : $response->withErrors(['verification' => VerificationEmailSender::ERROR_MESSAGE]);
    }

    public function updatePassword(Request $request){
         $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();
        $user->password = Hash::make($request->password);
        
        $user->save();

        return redirect()->route('admin.dashboard');
    }

    public function createAdmin(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'nickname' => 'required|string|max:255|unique:users,nickname,',
            'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
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
