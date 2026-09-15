<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Follow;
use App\Models\Post;
use App\Models\User;
use App\Services\ReaderNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SocialController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['post' => ['nullable', 'integer'], 'saved' => ['nullable', 'boolean']]);
        if ($request->filled('post')) {
            Post::findOrFail($request->integer('post'));
        }
        $user = User::find(auth()->id());
        $followingIds = $user->follows->pluck('id');
        $unreadMessages = DB::table('direct_messages')->where('recipient_id', $user->id)->whereNull('read_at')
            ->selectRaw('sender_id, COUNT(*) as total')->groupBy('sender_id')->pluck('total', 'sender_id');
        $conversations = DB::table('direct_messages')
            ->where(fn ($query) => $query->where('sender_id', $user->id)->orWhere('recipient_id', $user->id))
            ->selectRaw('CASE WHEN sender_id = ? THEN recipient_id ELSE sender_id END as partner_id, MAX(id) as latest_id', [$user->id])
            ->groupBy('partner_id')->orderByDesc('latest_id')->pluck('partner_id');
        $userSummary = fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'nickname' => $user->nickname,
            'isFollowing' => $followingIds->contains($user->id),
            'unreadMessages' => (int) ($unreadMessages[$user->id] ?? 0),
        ];

        return Inertia::render('social', [
            'filters' => ['saved' => $request->boolean('saved'), 'post' => $request->input('post')],
            'conversationUsers' => User::whereIn('id', $conversations)->where('is_admin', false)->get()
                ->sortBy(fn ($person) => $conversations->search($person->id))->values()->map($userSummary),
            'trendingPosts' => Post::with('user:id,name')
                ->withCount([
                    'likes' => fn ($query) => $query->where('post_likes.created_at', '>=', now()->subDays(7)),
                    'comments' => fn ($query) => $query->where('post_comments.created_at', '>=', now()->subDays(7)),
                ])
                ->where(fn ($query) => $query
                    ->whereHas('likes', fn ($likes) => $likes->where('post_likes.created_at', '>=', now()->subDays(7)))
                    ->orWhereHas('comments', fn ($comments) => $comments->where('post_comments.created_at', '>=', now()->subDays(7))))
                ->orderByRaw('(likes_count + comments_count) DESC')->orderByDesc('id')->limit(3)->get()
                ->map(fn (Post $post) => [
                    'id' => $post->id, 'author' => $post->user?->name,
                    'content' => Str::limit($post->content ?: 'Publicação com imagem', 90),
                    'interactions' => $post->likes_count + $post->comments_count,
                ]),
            'posts' => Post::with(['user', 'book.author', 'comments.user'])
                ->withCount(['likes', 'comments'])
                ->withExists([
                    'likes as is_liked' => fn ($query) => $query->where('users.id', $user->id),
                    'saves as is_saved' => fn ($query) => $query->where('users.id', $user->id),
                ])
                ->when($request->filled('post'), fn ($query) => $query->whereKey($request->integer('post')))
                ->when($request->boolean('saved'), fn ($query) => $query->whereHas('saves', fn ($saved) => $saved->where('users.id', $user->id)))
                ->latest()
                ->orderByDesc('id')
                ->get()
                ->map(fn (Post $post) => (new PostResource($post))->resolve($request)),
            'suggestedUsers' => User::where('id', '!=', auth()->id())
                ->where('is_admin', false)
                ->whereNotIn('id', $followingIds)
                ->limit(5)
                ->get()
                ->map($userSummary),
            'followedUsers' => User::whereIn('id', $followingIds)
                ->where('is_admin', false)
                ->get()
                ->map($userSummary),
            'allUsers' => User::where('id', '!=', auth()->id())
                ->where('is_admin', false)
                ->get()
                ->map($userSummary),
        ]);
    }

    public function profile()
    {
        $profileUser = User::withCount(['followers', 'follows as following_count'])->findOrFail(auth()->id());
        $profileUser->setAttribute('reading_books_count', DB::table('reading_progresses')->where('user_id', $profileUser->id)->count());
        $profileUser->setAttribute('shelf_books_count', DB::table('book_favorites')->where('user_id', $profileUser->id)->count());
        $profileUser->setAttribute('rated_books_count', DB::table('book_ratings')->where('user_id', $profileUser->id)->count());
        $profileUser->setAttribute('posts_count', DB::table('posts')->where('fk_user_id', $profileUser->id)->count());

        $posts = Post::where('fk_user_id', auth()->id())
            ->with('book.author')
            ->withCount(['likes', 'comments'])
            ->latest()
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'imageUrl' => $post->media_url ? asset('storage/'.$post->media_url) : null,
                'caption' => $post->content,
                'likes' => $post->likes_count,
                'comments' => $post->comments_count,
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
            'profileUser' => $profileUser,
        ]);
    }

    public function people($id)
    {
        $targetUser = User::withCount(['followers', 'follows as following_count'])->findOrFail($id);
        $targetUser->setAttribute('reading_books_count', DB::table('reading_progresses')->where('user_id', $targetUser->id)->count());
        $targetUser->setAttribute('shelf_books_count', DB::table('book_favorites')->where('user_id', $targetUser->id)->count());
        $targetUser->setAttribute('rated_books_count', DB::table('book_ratings')->where('user_id', $targetUser->id)->count());
        $targetUser->setAttribute('posts_count', DB::table('posts')->where('fk_user_id', $targetUser->id)->count());

        return Inertia::render('userProfilePage', [
            'users' => User::where('id', '!=', auth()->id())->where('is_admin', false)->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'nickname' => $user->nickname,
                    'description' => $user->description,
                    'profile_photo' => $user->profile_photo,
                    'read_books' => [],
                    'reading_books' => [],
                    'reading_books_count' => DB::table('reading_progresses')->where('user_id', $user->id)->count(),
                    'shelf_books' => [],
                    'rated_books' => [],
                    'shelf_books_count' => DB::table('book_favorites')->where('user_id', $user->id)->count(),
                    'rated_books_count' => DB::table('book_ratings')->where('user_id', $user->id)->count(),
                    'posts_count' => DB::table('posts')->where('fk_user_id', $user->id)->count(),
                ];
            }),

            'targetUser' => $targetUser->only([
                'id', 'name', 'nickname', 'description', 'profile_photo',
                'read_books', 'reading_books', 'shelf_books', 'rated_books',
                'followers_count', 'following_count', 'reading_books_count',
                'shelf_books_count', 'rated_books_count', 'posts_count',
            ]),
            'isFollowing' => Follow::where('fk_follower_id', auth()->id())
                ->where('fk_followed_id', $id)
                ->exists(),

        ]);
    }

    public function follow($id)
    {
        $target = User::where('is_admin', false)->findOrFail($id);
        abort_if($target->id === auth()->id(), 422);
        $follow = Follow::firstOrCreate([
            'fk_follower_id' => auth()->id(),
            'fk_followed_id' => $id,
        ]);
        if ($follow->wasRecentlyCreated) {
            ReaderNotificationService::send($target->id, auth()->id(), 'follow');
        }

        return back();
    }

    public function unfollow($id)
    {
        Follow::where('fk_follower_id', auth()->id())
            ->where('fk_followed_id', $id)
            ->delete();

        return back();
    }

    public function destroyPost($id)
    {
        $post = Post::findOrFail($id);
        abort_unless($post->fk_user_id === auth()->id(), 403);
        $post->delete();

        if (parse_url(url()->previous(), PHP_URL_PATH) === '/social') {
            return redirect()->route('list');
        }

        return back()->with('success', 'Publicação excluída com sucesso.');
    }
}
