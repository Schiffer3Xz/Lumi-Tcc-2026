<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ReaderNotificationCreated implements ShouldBroadcast
{
    public function __construct(private int $userId) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("notifications.user.{$this->userId}")];
    }

    public function broadcastWith(): array
    {
        return [];
    }
}
