<?php

use App\Models\ConversationUser;
use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return Conversation::whereKey($conversationId)->where('is_group', false)->exists()
        && ConversationUser::where('fk_conversation_id', $conversationId)
        ->where('fk_user_id', $user->id)
        ->exists();
});

Broadcast::channel('conversation.{conversationId}.user.{userId}', function ($user, $conversationId, $userId) {
    return (int) $userId === $user->id
        && Conversation::whereKey($conversationId)->where('is_group', true)->exists()
        && ConversationUser::where('fk_conversation_id', $conversationId)->where('fk_user_id', $user->id)->exists();
});
