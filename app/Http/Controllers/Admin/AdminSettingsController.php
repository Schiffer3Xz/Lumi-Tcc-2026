<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

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
        return view('admin/settings/emailVerification');
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
    public function update(Request $request){
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

        if ($firstLogin) {
            $user->sendEmailVerificationNotification();
            return redirect()->route('admin.email-verification');
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

    public function updateEmail(Request $request){
         $request->validate([
            'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
            'current_password' => 'required|current_password',
        ]);

        $user = auth()->user();
        $user->email = $request->email;
        $user->email_verified_at = null;
        
        $user->save();

        $user->sendEmailVerificationNotification();
        return redirect()->route('verification.notice');
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
