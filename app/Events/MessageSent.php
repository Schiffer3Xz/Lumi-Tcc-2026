<?php

namespace App\Events;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;
    public function __construct(public Message $message)
    {
    }
    public function broadcastOn(): array
    {
        $conversation = Conversation::find($this->message->fk_conversation_id);
        if (!$conversation) {
            return [];
        }

        if ($conversation->is_group) {
            return $conversation->participants()->pluck('users.id')
                ->map(fn ($id) => new PrivateChannel("conversation.{$conversation->id}.user.{$id}"))->all();
        }

        return [new PrivateChannel('conversation.'.$conversation->id)];
    }

    public function broadcastWith(): array
    {
        return ['message' => [
            'id' => $this->message->id,
            'fk_user_id' => $this->message->fk_user_id,
            'fk_conversation_id' => $this->message->fk_conversation_id,
            'content' => $this->message->content,
            'created_at' => $this->message->created_at?->toIso8601String(),
            'user_name' => $this->message->user?->name,
        ]];
    }
}
