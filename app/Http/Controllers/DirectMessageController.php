<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DirectMessageController extends Controller
{
    private function recipient(Request $request, int $id): User
    {
        abort_if($id === $request->user()->id, 422);

        return User::where('is_admin', false)->findOrFail($id);
    }

    public function index(Request $request, int $id)
    {
        $recipient = $this->recipient($request, $id);
        $request->validate(['before' => ['nullable', 'integer', 'min:1']]);
        $viewer = $request->user()->id;
        $messages = DB::table('direct_messages')
            ->where(fn ($query) => $query
                ->where(fn ($pair) => $pair->where('sender_id', $viewer)->where('recipient_id', $recipient->id))
                ->orWhere(fn ($pair) => $pair->where('sender_id', $recipient->id)->where('recipient_id', $viewer)))
            ->when($request->filled('before'), fn ($query) => $query->where('id', '<', $request->integer('before')))
            ->orderByDesc('id')->limit(51)->get(['id', 'sender_id', 'content', 'created_at', 'read_at']);

        return response()->json([
            'messages' => $messages->take(50)->reverse()->values(),
            'hasOlder' => $messages->count() > 50,
        ]);
    }

    public function store(Request $request, int $id)
    {
        $recipient = $this->recipient($request, $id);
        $validated = $request->validate(['content' => ['required', 'string', 'max:2000']]);
        DB::table('direct_messages')->insert([
            'sender_id' => $request->user()->id,
            'recipient_id' => $recipient->id,
            'content' => $validated['content'],
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return response()->json(['sent' => true], 201);
    }

    public function read(Request $request, int $id)
    {
        $recipient = $this->recipient($request, $id);
        $validated = $request->validate(['through' => ['required', 'integer', 'min:1']]);
        DB::table('direct_messages')->where('sender_id', $recipient->id)
            ->where('recipient_id', $request->user()->id)->where('id', '<=', $validated['through'])
            ->whereNull('read_at')->update(['read_at' => now(), 'updated_at' => now()]);

        return response()->noContent();
    }
}
