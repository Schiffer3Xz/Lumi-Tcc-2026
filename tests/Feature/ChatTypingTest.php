<?php

namespace Tests\Feature;

use App\Events\UserTyping;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ChatTypingTest extends TestCase
{
    use RefreshDatabase;

    public function test_participants_can_notify_typing_in_private_chats_and_groups(): void
    {
        Event::fake([UserTyping::class]);
        [$sender, $recipient] = User::factory()->count(2)->create()->all();

        foreach ([false, true] as $isGroup) {
            $conversation = Conversation::create(['is_group' => $isGroup]);
            $conversation->participants()->attach([$sender->id, $recipient->id]);

            $this->actingAs($sender)->postJson(route('chat.typing', $conversation))->assertNoContent();

            Event::assertDispatched(UserTyping::class, function ($event) use ($conversation, $sender, $recipient, $isGroup) {
                $channels = array_map(fn ($channel) => $channel->name, $event->broadcastOn());

                return $event->conversationId === $conversation->id
                    && $event->broadcastWith() === ['user_id' => $sender->id, 'user_name' => $sender->name]
                    && in_array($isGroup
                        ? "private-conversation.{$conversation->id}.user.{$recipient->id}"
                        : "private-conversation.{$conversation->id}", $channels, true);
            });
        }

        $this->assertDatabaseCount('messages', 0);
    }

    public function test_non_participants_cannot_notify_typing(): void
    {
        Event::fake([UserTyping::class]);
        $outsider = User::factory()->create();
        $conversation = Conversation::create(['is_group' => false]);

        $this->actingAs($outsider)->postJson(route('chat.typing', $conversation))->assertForbidden();

        Event::assertNotDispatched(UserTyping::class);
    }
}
