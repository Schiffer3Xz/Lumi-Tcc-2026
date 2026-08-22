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
        return Inertia::render("personalProfile");
    }

    public function people($id){
        $targetUser = User::find($id);

        return Inertia::render("userProfilePage", [
            "users" => User::where('id', '!=', auth()->id())->where('is_admin', false)->get()->map(function ($user) {
                return [
                    "id" => $user->id,
                    "name" => $user->name,
                    "nickname" => $user->nickname,
                    "description" => $user->description,
                    "profile_photo" => $user->profile_photo,
                    "read_books" => $user->read_books,
                    "reading_books" => $user->reading_books,
                    "shelf_books" => $user->shelf_books,
                    "rated_books" => $user->rated_books,
                ];
            }),

            "targetUser" => $targetUser,

        ]);
    }
}
