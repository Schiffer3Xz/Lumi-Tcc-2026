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

    public function emailVerification(){
        return view('admin/settings/emailVerification/email');
    }

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
        }

        return redirect()->route('adminPanel');
    }
}
