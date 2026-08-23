<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Follow;

class SocialController extends Controller
{
    public function index()
    {
        $user = User::find(auth()->id());
        $followingIds = $user->follows->pluck('id');

        return Inertia::render("social", [
            "users" => User::where('id', '!=', auth()->id())->where('is_admin', false)->whereNotIn('id', $followingIds)->limit(5)->get()->map(function ($user) {
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
            "isFollowing" => Follow::where('fk_follower_id', auth()->id())
                ->where('fk_followed_id', $id)
                ->exists(),

        ]);
    }

    public function follow($id){
        Follow::firstOrCreate([
            "fk_follower_id" => auth()->id(),
            "fk_followed_id" => $id,
        ]);
    }

    public function unfollow($id){
        Follow::where('fk_follower_id', auth()->id())
            ->where('fk_followed_id', $id)
            ->delete();
    }
}
