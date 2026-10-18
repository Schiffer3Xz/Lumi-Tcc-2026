<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class UserTyping implements ShouldBroadcastNow
{
    public function __construct(
        public int $conversationId,
        public int $userId,
        public string $userName,
        private bool $isGroup,
        private array $participantIds,
    ) {}

    public function broadcastOn(): array
    {
        if ($this->isGroup) {
            return array_map(fn ($id) => new PrivateChannel("conversation.{$this->conversationId}.user.{$id}"), $this->participantIds);
        }

        return [new PrivateChannel("conversation.{$this->conversationId}")];
    }

    public function broadcastWith(): array
    {
        return ['user_id' => $this->userId, 'user_name' => $this->userName];
    }
}
