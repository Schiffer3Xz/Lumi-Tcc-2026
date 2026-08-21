<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class SocialController extends Controller
{
    public function index()
    {
        return Inertia::render("social", [
            "users" => User::where('id', '!=', auth()->id())->where('is_admin', false)->limit(5)->get()->map(function ($user) {
                return [
                    "id" => $user->id,
                    "name" => $user->name,
                    "nickname" => $user->nickname,
                ];
            })
        ]);
    }

    public function profile(){
        return Inertia::render("profile");
    }
}
