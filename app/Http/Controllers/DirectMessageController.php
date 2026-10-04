<?php

namespace App\Http\Controllers;

use App\Events\ConversationUpdated;
use App\Events\GroupUpdated;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DirectMessageController extends Controller
{
    public function start(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $myId = $request->user()->id;
        $userId = (int) $validated['user_id'];
        abort_if($myId === $userId, 422);
        User::whereKey($userId)->where('is_admin', false)->firstOrFail();

        $conversation = DB::transaction(function () use ($myId, $userId) {
            $conversation = Conversation::where('is_group', false)
                ->has('participants', '=', 2)
                ->whereHas('participants', fn ($query) => $query->where('users.id', $myId))
                ->whereHas('participants', fn ($query) => $query->where('users.id', $userId))
                ->first();

            if (! $conversation) {
                $conversation = Conversation::create(['is_group' => false]);
                $conversation->participants()->attach([$myId, $userId]);
            }

            return $conversation;
        });

        return $this->sendMessage($request, $conversation, $validated['content']);
    }

    public function createGroup(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'participants' => ['required', 'array', 'min:2', 'max:49'],
            'participants.*' => [
                'required', 'integer', 'distinct',
                Rule::notIn([$request->user()->id]),
                Rule::exists('users', 'id')->where('is_admin', 0),
            ],
        ]);

        $conversation = DB::transaction(function () use ($request, $validated) {
            $conversation = Conversation::create([
                'name' => $validated['name'], 'is_group' => true, 'created_by' => $request->user()->id,
            ]);
            $conversation->participants()->attach([$request->user()->id, ...$validated['participants']]);

            return $conversation;
        });

        event(new ConversationUpdated($conversation->id, $conversation->participants()->pluck('users.id')->all()));

        return to_route('list', ['group' => $conversation->id]);
    }

    public function sendToGroup(Request $request, Conversation $conversation)
    {
        abort_unless($conversation->is_group, 404);
        abort_unless($conversation->participants()->where('users.id', $request->user()->id)->exists(), 403);
        $validated = $request->validate(['content' => ['required', 'string', 'max:5000']]);

        return $this->sendMessage($request, $conversation, $validated['content']);
    }

    public function removeParticipant(Request $request, Conversation $conversation, User $user)
    {
        $this->authorizeGroupOwner($request, $conversation);
        abort_if($user->id === (int) $conversation->created_by, 422, 'O criador não pode ser removido do grupo.');

        $participantIds = DB::transaction(function () use ($conversation, $user) {
            Conversation::whereKey($conversation->id)->lockForUpdate()->firstOrFail();
            $participantIds = $conversation->participants()->pluck('users.id')->all();
            abort_unless(in_array($user->id, $participantIds), 404);
            $conversation->participants()->detach($user->id);

            return $participantIds;
        });

        event(new GroupUpdated($conversation->id, $participantIds, $user->id));
        event(new ConversationUpdated($conversation->id, $participantIds, $user->id));

        return response()->noContent();
    }

    public function destroyGroup(Request $request, Conversation $conversation)
    {
        $this->authorizeGroupOwner($request, $conversation);
        $participantIds = DB::transaction(function () use ($conversation) {
            Conversation::whereKey($conversation->id)->lockForUpdate()->firstOrFail();
            $participantIds = $conversation->participants()->pluck('users.id')->all();
            Message::where('fk_conversation_id', $conversation->id)->delete();
            $conversation->participants()->detach();
            $conversation->delete();

            return $participantIds;
        });

        event(new GroupUpdated($conversation->id, $participantIds, deleted: true));
        event(new ConversationUpdated($conversation->id, $participantIds, deleted: true));

        return response()->noContent();
    }

    private function authorizeGroupOwner(Request $request, Conversation $conversation): void
    {
        abort_unless($conversation->is_group, 404);
        abort_unless((int) $conversation->created_by === $request->user()->id
            && $conversation->participants()->where('users.id', $request->user()->id)->exists(), 403);
    }

    private function sendMessage(Request $request, Conversation $conversation, string $content)
    {
        $message = DB::transaction(function () use ($request, $conversation, $content) {
            $current = Conversation::whereKey($conversation->id)->lockForUpdate()->firstOrFail();
            abort_unless($current->participants()->where('users.id', $request->user()->id)->exists(), 403);

            return Message::create([
                'fk_user_id' => $request->user()->id,
                'fk_conversation_id' => $current->id,
                'content' => $content,
            ]);
        });

        event(new MessageSent($message));
        event(new ConversationUpdated($conversation->id, $conversation->participants()->pluck('users.id')->all()));

        return response()->json([
            'sent' => true,
            'conversation_id' => $conversation->id,
            'message' => [
                'id' => $message->id,
                'user_id' => $message->fk_user_id,
                'content' => $message->content,
                'created_at' => $message->created_at->toIso8601String(),
            ],
        ], 201);
    }
}
