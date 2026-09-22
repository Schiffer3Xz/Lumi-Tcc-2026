<?php

use App\Models\ConversationUser;
use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return ConversationUser::where('fk_conversation_id', $conversationId)
        ->where('fk_user_id', $user->id)
        ->exists();
});
