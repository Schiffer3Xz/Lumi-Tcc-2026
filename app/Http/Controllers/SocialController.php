<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Follow;
use App\Models\Post;

class SocialController extends Controller
{
    public function index()
    {
        $user = User::find(auth()->id());
        $followingIds = $user->follows->pluck('id');
        $userSummary = fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'nickname' => $user->nickname,
        ];

        return Inertia::render("social", [
            "posts" => Post::with(['user', 'book.author'])
                ->latest()
                ->orderByDesc('id')
                ->get()
                ->map(fn (Post $post) => [
                    'id' => $post->id,
                    'content' => $post->content,
                    'image' => $post->media_url ? asset('storage/' . $post->media_url) : null,
                    'time' => $post->created_at?->locale('pt_BR')->diffForHumans(),
                    'author' => [
                        'name' => $post->user?->name,
                        'username' => ltrim($post->user?->nickname ?? '', '@'),
                    ],
                    'book' => $post->book ? [
                        'title' => $post->book->title,
                        'author' => $post->book->author?->name,
                        'badge' => 'Livro',
                        'coverBg' => 'bg-slate-800',
                    ] : null,
                    'likesCount' => 0,
                    'commentsCount' => 0,
                    'comments' => [],
                ]),
            "suggestedUsers" => User::where('id', '!=', auth()->id())
                ->where('is_admin', false)
                ->whereNotIn('id', $followingIds)
                ->limit(5)
                ->get()
                ->map($userSummary),
            "followedUsers" => User::whereIn('id', $followingIds)
                ->where('is_admin', false)
                ->get()
                ->map($userSummary),
            "allUsers" => User::where('id', '!=', auth()->id())
                ->where('is_admin', false)
                ->get()
                ->map($userSummary),
        ]);
    }

    public function profile()
    {
        $posts = Post::where('fk_user_id', auth()->id())
            ->with('book.author')
            ->latest()
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'imageUrl' => $post->media_url ? asset('storage/' . $post->media_url) : null,
                'caption' => $post->content,
                'likes' => 0,
                'comments' => 0,
                'time' => $post->created_at?->locale('pt_BR')->diffForHumans(),
                'book' => $post->book ? [
                    'title' => $post->book->title,
                    'publisher' => $post->book->publisher,
                    'page_count' => $post->book->page_count,
                    'publication_year' => $post->book->publication_year,
                    'readers_count' => $post->book->readers_count,
                    'rating' => $post->book->rating,
                ] : null,
            ]);

        return Inertia::render('personalProfile', [
            'posts' => $posts,
        ]);
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

    public function destroyPost($id)
    {
        Post::where('id', $id)
            ->where('fk_user_id', auth()->id())
            ->delete();

        return back()->with('success', 'Publicação excluída com sucesso.');
    }
}
