<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class ConversationUpdated implements ShouldBroadcast
{
    use Dispatchable;

    public function __construct(
        public int $conversationId,
        private array $participantIds,
        public ?int $removedUserId = null,
        public bool $deleted = false,
    ) {}

    public function broadcastOn(): array
    {
        return array_map(fn ($id) => new PrivateChannel("chat.user.{$id}"), $this->participantIds);
    }

    // The inbox receives only an invalidation signal. Content is fetched with
    // the current membership checks, including after removal from a group.
    public function broadcastWith(): array
    {
        return [
            'conversationId' => $this->conversationId,
            'removedUserId' => $this->removedUserId,
            'deleted' => $this->deleted,
        ];
    }
}
