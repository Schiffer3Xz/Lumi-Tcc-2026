<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Follow;
use App\Models\Conversation;
use App\Models\ConversationUser;
use App\Models\Message;
use App\Models\Post;
use App\Models\ReadingRule;
use App\Models\User;
use App\Services\ReaderNotificationService;
use App\Services\LibraryNotices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SocialController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'post' => ['nullable', 'integer'],
            'saved' => ['nullable', 'boolean'],
            'group' => ['nullable', 'integer'],
            'notice' => ['nullable', 'integer'],
            'sort' => ['nullable', 'in:following,recent'],
        ]);
        $sort = $request->boolean('saved') || $request->filled('post')
            ? 'recent'
            : ($request->input('sort') ?? 'following');
        if ($request->filled('post')) {
            Post::social()->findOrFail($request->integer('post'));
        }
        $user = User::find(auth()->id());
        $notices = LibraryNotices::listing()->activeLibraryNotices();
        $selectedNotice = $request->filled('notice') ? (clone $notices)->findOrFail($request->integer('notice')) : null;
        if ($selectedNotice) {
            LibraryNotices::markRead($selectedNotice, $user);
            $selectedNotice->has_read = true;
        }
        $followingIds = $user->follows->pluck('id');
        $conversationIds = ConversationUser::where('fk_user_id', $user->id)->pluck('fk_conversation_id');
        $conversations = Conversation::with('participants:id,name')->whereIn('id', $conversationIds)->get()->keyBy('id');
        $recipients = ConversationUser::whereIn('fk_conversation_id', $conversationIds)->where('fk_user_id', '!=', $user->id)->get()->groupBy('fk_conversation_id');
        $messagesByConversation = Message::with('user:id,name')->whereIn('fk_conversation_id', $conversationIds)
            ->orderBy('created_at')
            ->get()
            ->groupBy('fk_conversation_id');
        $directMessages = [];
        $groupConversations = [];

        foreach ($conversations as $conversationId => $conversation) {
            $participants = $recipients->get($conversationId, collect());
            $messages = $messagesByConversation->get($conversationId, collect())
                ->map(fn (Message $message) => [
                    'id' => $message->id,
                    'user_id' => $message->fk_user_id,
                    'user_name' => $message->user?->name,
                    'content' => $message->content,
                    'created_at' => $message->created_at?->toIso8601String(),
                ])
                ->values()
                ->all();

            if ($conversation->is_group) {
                $groupConversations[] = [
                    'id' => $conversation->id,
                    'name' => $conversation->name,
                    'is_group' => true,
                    'created_by' => $conversation->created_by,
                    'can_manage' => (int) $conversation->created_by === $user->id,
                    'participants' => $conversation->participants->map(fn ($member) => ['id' => $member->id, 'name' => $member->name])->values(),
                    'messages' => $messages,
                ];
                continue;
            }

            foreach ($participants as $participant) {
                $directMessages[(string) $participant->fk_user_id] = [
                    'conversation_id' => $conversationId,
                    'messages' => $messages,
                ];
            }
        }
        $userSummary = fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'profile_photo' => $user->profile_photo,
            'nickname' => $user->nickname,
            'isFollowing' => $followingIds->contains($user->id),
        ];

        return Inertia::render('social', [
            'filters' => ['saved' => $request->boolean('saved'), 'post' => $request->input('post'), 'group' => $request->integer('group'), 'chat' => $request->integer('chat'), 'sort' => $sort],
            'selectedNotice' => $selectedNotice ? LibraryNotices::data($selectedNotice, $user) : null,
            'libraryNotices' => fn () => $notices
                ->withExists(['noticeReaders as has_read' => fn ($query) => $query->where('users.id', $user->id)])
                ->paginate(5, pageName: 'notices_page')->withQueryString()
                ->through(fn (Post $notice) => LibraryNotices::data($notice, $user)),
            'directMessages' => $directMessages,
            'groupConversations' => $groupConversations,
            'conversationUsers' => User::whereIn('id', array_keys($directMessages))->where('is_admin', false)->get()->map($userSummary),
            'trendingPosts' => Post::social()->with('user:id,name')
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
            'posts' => Post::social()->with(['user', 'book.author', 'comments.user'])
                ->withCount(['likes', 'comments'])
                ->withExists([
                    'likes as is_liked' => fn ($query) => $query->where('users.id', $user->id),
                    'saves as is_saved' => fn ($query) => $query->where('users.id', $user->id),
                ])
                ->when($request->filled('post'), fn ($query) => $query->whereKey($request->integer('post')))
                ->when($request->boolean('saved'), fn ($query) => $query->whereHas('saves', fn ($saved) => $saved->where('users.id', $user->id)))
                ->when($sort === 'following', fn ($query) => $query->orderByRaw(
                    'CASE WHEN EXISTS (SELECT 1 FROM follows WHERE follows.fk_follower_id = ? AND follows.fk_followed_id = posts.fk_user_id) THEN 0 ELSE 1 END',
                    [$user->id],
                ))
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
        $profileUser = User::with(['followers:id,name,nickname,profile_photo', 'follows:id,name,nickname,profile_photo'])
            ->withCount(['followers', 'follows as following_count'])
            ->findOrFail(auth()->id());
        $profileUser->setAttribute('reading_books_count', DB::table('reading_progresses')->where('user_id', $profileUser->id)->count());
        $profileUser->setAttribute('shelf_books_count', DB::table('book_favorites')->where('user_id', $profileUser->id)->count());
        $profileUser->setAttribute('rated_books_count', DB::table('book_ratings')->where('user_id', $profileUser->id)->count());
        $profileUser->setAttribute('posts_count', DB::table('posts')->where('fk_user_id', $profileUser->id)->count());

        $posts = Post::social()->where('fk_user_id', auth()->id())
            ->with(['book.author', 'book' => fn ($query) => $query->withReaderCount()->withAvg('ratings', 'rating')])
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
                    'id' => $post->book->id,
                    'author' => $post->book->author?->name,
                    'cover_url' => $post->book->cover_url
                        ? (str_starts_with($post->book->cover_url, 'http') ? $post->book->cover_url : asset('storage/'.$post->book->cover_url))
                        : null,
                    'title' => $post->book->title,
                    'publisher' => $post->book->publisher,
                    'page_count' => $post->book->page_count,
                    'publication_year' => $post->book->publication_year,
                    'readers_count' => $post->book->readers_count,
                    'rating' => (float) ($post->book->ratings_avg_rating ?? 0),
                ] : null,
            ]);

        return Inertia::render('personalProfile', [
            'readingRules' => ReadingRule::displayList()->get(),
            'posts' => $posts,
            'profileUser' => $profileUser,
        ]);
    }

    public function people($id)
    {
        $targetUser = User::with(['followers:id,name,nickname,profile_photo', 'follows:id,name,nickname,profile_photo'])
            ->withCount(['followers', 'follows as following_count'])
            ->findOrFail($id);
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

            'targetUser' => array_merge($targetUser->only([
                'id', 'name', 'nickname', 'description', 'profile_photo',
                'read_books', 'reading_books', 'shelf_books', 'rated_books',
                'followers_count', 'following_count', 'reading_books_count',
                'shelf_books_count', 'rated_books_count', 'posts_count',
            ]), [
                'followers' => $targetUser->followers->map(fn (User $person) => $person->only(['id', 'name', 'nickname', 'profile_photo']))->values(),
                'follows' => $targetUser->follows->map(fn (User $person) => $person->only(['id', 'name', 'nickname', 'profile_photo']))->values(),
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
        $post = Post::social()->findOrFail($id);
        abort_unless($post->fk_user_id === auth()->id(), 403);
        $post->delete();

        if (parse_url(url()->previous(), PHP_URL_PATH) === '/social') {
            return redirect()->route('list');
        }

        return back()->with('success', 'Publicação excluída com sucesso.');
    }
}
