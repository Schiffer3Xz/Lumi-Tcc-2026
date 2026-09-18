<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\ConversationUser;
use App\Models\Message;
use App\Models\User;

class DirectMessageController extends Controller
{   
    public function start(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'content' => ['required', 'string', 'max:5000'],
            'group_name' => ['nullable', 'string', 'max:255'],
        ]);

        $myId = auth()->id();
        $userId = $validated['user_id'];

        abort_if($myId === $userId, 422);
        
        User::whereKey($userId)->where('is_admin', false)->firstOrFail();

        $myConversations = ConversationUser::where('fk_user_id', $myId)->pluck('fk_conversation_id');

        $conversationId = ConversationUser::whereIn('fk_conversation_id', $myConversations)
            ->where('fk_user_id', $userId)
            ->value('fk_conversation_id');



        if(empty($conversationId)){
            $conversation = Conversation::create([
                'name' => $validated['group_name'] ?? null,
            ]);

             $conversationId = $conversation->id;

            ConversationUser::create([
                'fk_user_id' => $myId,
                'fk_conversation_id' => $conversationId,
            ]);

            ConversationUser::create([
                'fk_user_id' => $userId,
                'fk_conversation_id' => $conversationId,
            ]);
        }

        $this->sendMessage($validated['content'], $conversationId);

        return response()->json(['sent' => true], 201);
    }


    //Agora eu preciso fazer a logica pra criar a msg com o conteudo
    public function sendMessage(string $content, $conversationId)
    {
        Message::create([
            'fk_user_id' => auth()->id(),
            'fk_conversation_id' => $conversationId,
            'content' => $content,
        ]);
    }
}