<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReaderAccountController extends Controller
{
    public function history(Request $request)
    {
        $entries = collect();
        foreach (['reading_progresses' => 'reading', 'book_favorites' => 'saved', 'book_ratings' => 'rating'] as $table => $kind) {
            $records = DB::table($table.' as activity')
                ->join('books', 'books.id', '=', 'activity.book_id')
                ->leftJoin('authors', 'authors.id', '=', 'books.fk_author_id')
                ->where('activity.user_id', $request->user()->id)
                ->select('activity.*', 'books.title', 'books.page_count', 'authors.name as author')
                ->get();
            foreach ($records as $record) {
                $entries->push([
                    'id' => $kind.'-'.$record->id,
                    'kind' => $kind,
                    'title' => $record->title,
                    'author' => $record->author,
                    'url' => route('book.show', $record->book_id),
                    'bookId' => $record->book_id,
                    'date' => $record->updated_at,
                    'currentPage' => $record->current_page ?? null,
                    'pageCount' => $record->page_count,
                    'rating' => $record->rating ?? null,
                ]);
            }
        }

        return Inertia::render('readingHistory', ['entries' => $entries->sortByDesc('date')->values()]);
    }

    public function privacy()
    {
        return Inertia::render('privacy');
    }

    public function updatePrivacy(Request $request)
    {
        $validated = $request->validate([
            'public_reviews' => ['required', 'boolean'],
            'social_notifications' => ['required', 'boolean'],
        ]);
        $request->user()->forceFill($validated)->save();

        return back();
    }

    public function notifications(Request $request)
    {
        $notifications = DB::table('reader_notifications as notifications')
            ->join('users as actors', 'actors.id', '=', 'notifications.actor_id')
            ->where('notifications.user_id', $request->user()->id)
            ->orderByDesc('notifications.id')
            ->select('notifications.id', 'notifications.kind', 'notifications.read_at', 'notifications.created_at', 'actors.name as actor')
            ->paginate(20);

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json(['notifications' => $notifications]);
        }

        return Inertia::render('notifications', ['notifications' => $notifications]);
    }

    public function openNotification(Request $request, int $id)
    {
        $notification = DB::table('reader_notifications')->where('user_id', $request->user()->id)->where('id', $id)->first();
        abort_unless($notification, 404);
        DB::table('reader_notifications')->where('id', $notification->id)->whereNull('read_at')->update(['read_at' => now(), 'updated_at' => now()]);

        return $notification->post_id
            ? redirect()->route('list', ['post' => $notification->post_id])
            : redirect()->route('people', $notification->actor_id);
    }

    public function readNotifications(Request $request)
    {
        DB::table('reader_notifications')->where('user_id', $request->user()->id)->whereNull('read_at')->update(['read_at' => now(), 'updated_at' => now()]);

        return back();
    }
}
