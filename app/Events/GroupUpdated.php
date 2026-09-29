<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class GroupUpdated implements ShouldBroadcast
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
        return array_map(fn ($id) => new PrivateChannel("conversation.{$this->conversationId}.user.{$id}"), $this->participantIds);
    }
}
