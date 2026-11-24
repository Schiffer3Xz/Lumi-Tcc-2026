<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\BookListing;
use App\Services\LibraryNotices;
use App\Services\Moderation\PublicationModeration;
use App\Services\PostImages;
use App\Services\ReaderNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Throwable;

class AdminLibraryNoticeController extends Controller
{
    private const DURATIONS = [
        '1h' => '1 hora',
        '5h' => '5 horas',
        '24h' => '24 horas',
        '1w' => '1 semana',
        '1m' => '1 mês',
        '1y' => '1 ano',
    ];

    public function index(Request $request)
    {
        $user = $request->user();
        $listing = LibraryNotices::listing()->withCount('noticeReaders');
        $selected = $request->integer('notice') ? (clone $listing)->findOrFail($request->integer('notice')) : null;
        if ($selected && ! $selected->notice_removed_at) {
            LibraryNotices::markRead($selected, $user);
            $selected->loadCount('noticeReaders');
        }

        return Inertia::render('admin/library-notices/index', [
            'notices' => $listing->paginate(12)->through(fn (Post $notice) => LibraryNotices::data($notice, $user)),
            'selectedNotice' => $selected ? LibraryNotices::data($selected, $user) : null,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/library-notices/form', ['durations' => self::DURATIONS]);
    }

    public function edit(Request $request, int $notice)
    {
        $post = LibraryNotices::listing()->whereNull('notice_removed_at')->findOrFail($notice);
        abort_unless(LibraryNotices::canManage($post, $request->user()), 403);

        return Inertia::render('admin/library-notices/form', [
            'notice' => LibraryNotices::data($post, $request->user()),
            'durations' => self::DURATIONS,
        ]);
    }

    public function books(Request $request, BookListing $listing)
    {
        $books = $listing->query($listing->filters($request))->with('author:id,name')->orderBy('title')->orderBy('id')
            ->simplePaginate(20, ['id', 'title', 'cover_url', 'fk_author_id']);

        return response()->json([
            'books' => $books->getCollection()->map(PostResource::bookData(...)),
            'hasMore' => $books->hasMorePages(),
        ]);
    }

    public function store(Request $request, PublicationModeration $moderation)
    {
        $this->save($request, $moderation);

        return to_route('admin.library-notices.index')->with('success', 'Comunicado publicado.');
    }

    public function update(Request $request, PublicationModeration $moderation, int $notice)
    {
        $post = Post::libraryNotices()->whereNull('notice_removed_at')->findOrFail($notice);
        abort_unless(LibraryNotices::canManage($post, $request->user()), 403);
        $this->save($request, $moderation, $post);

        return to_route('admin.library-notices.index')->with('success', 'Comunicado atualizado.');
    }

    public function destroy(Request $request, int $notice)
    {
        DB::transaction(function () use ($request, $notice) {
            $post = Post::libraryNotices()->whereNull('notice_removed_at')->lockForUpdate()->findOrFail($notice);
            abort_unless(LibraryNotices::canManage($post, $request->user()), 403);
            $post->notice_removed_at = now();
            $post->save();
            DB::table('reader_notifications')->where('post_id', $post->id)
                ->where('kind', ReaderNotificationService::LIBRARY_NOTICE)->delete();
        });

        return to_route('admin.library-notices.index')->with('success', 'Comunicado retirado do mural.');
    }

    private function save(Request $request, PublicationModeration $moderation, ?Post $post = null): void
    {
        $data = $request->validate([
            'duration' => ['nullable', Rule::in(array_keys(self::DURATIONS))],
            'content' => ['nullable', 'string', 'max:5000'],
            'images' => ['sometimes', 'array', 'max:6'],
            'images.*' => ['required', ...PostImages::RULES],
            'keep_images' => ['sometimes', 'array', 'max:6'],
            'keep_images.*' => ['required', 'string', 'max:2048', 'distinct'],
            'book_ids' => ['sometimes', 'array', 'max:10'],
            'book_ids.*' => ['required', 'integer', 'distinct', 'exists:books,id'],
        ]);
        $content = $data['content'] ?? '';
        $uploads = $data['images'] ?? [];
        $bookIds = $data['book_ids'] ?? [];
        $keptUrls = $data['keep_images'] ?? [];
        $duration = $data['duration'] ?? ($post ? null : '24h');
        $moderation->validate($content);
        foreach ($uploads as $image) {
            $moderation->moderateImage($image, 'images');
        }

        $stored = [];
        try {
            foreach ($uploads as $image) {
                $stored[] = PostImages::store($image);
            }
            DB::transaction(function () use ($request, $post, $content, $stored, $keptUrls, $bookIds, $duration) {
                $notice = $post
                    ? Post::libraryNotices()->whereNull('notice_removed_at')->lockForUpdate()->findOrFail($post->id)
                    : new Post(['fk_user_id' => $request->user()->id]);
                $available = collect($notice->notice_images ?? [])->keyBy(fn ($path) => asset('storage/'.$path));
                $retained = $available->only($keptUrls)->values()->all();
                if (count($keptUrls) !== count($retained)) {
                    throw ValidationException::withMessages(['images' => 'As imagens do comunicado foram alteradas. Reabra a edição.']);
                }
                $images = [...$retained, ...$stored];
                if (count($images) > 6) {
                    throw ValidationException::withMessages(['images' => 'Adicione até seis imagens.']);
                }
                if (blank($content) && ! $images && ! $bookIds) {
                    throw ValidationException::withMessages(['content' => 'Escreva um texto, adicione uma imagem ou referencie um livro.']);
                }

                $notice->content = $content;
                $notice->is_library_notice = true;
                $notice->notice_images = $images;
                if ($duration !== null) {
                    $now = now();
                    $notice->notice_expires_at = match ($duration) {
                        '1h' => $now->addHour(),
                        '5h' => $now->addHours(5),
                        '24h' => $now->addHours(24),
                        '1w' => $now->addWeek(),
                        '1m' => $now->addMonthNoOverflow(),
                        '1y' => $now->addYearNoOverflow(),
                    };
                }
                $notice->save();
                $notice->noticeBooks()->sync($bookIds);
                if (! $post) {
                    ReaderNotificationService::publishLibraryNotice($notice->id, $request->user()->id);
                }
                $removed = array_diff($available->values()->all(), $retained);
                if ($removed) {
                    DB::afterCommit(fn () => rescue(fn () => Storage::disk('public')->delete(array_values($removed))));
                }
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($stored);
            throw $exception;
        }
    }
}
