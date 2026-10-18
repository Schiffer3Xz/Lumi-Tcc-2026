<?php

namespace Tests\Feature;

use App\Events\ReaderNotificationCreated;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ChatNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_messages_notify_other_participants_and_open_the_correct_chat(): void
    {
        Event::fake();
        [$sender, $recipient] = User::factory()->count(2)->create(['social_notifications' => true])->all();
        $muted = User::factory()->create(['social_notifications' => false]);

        foreach ([false, true] as $isGroup) {
            $conversation = Conversation::create(['is_group' => $isGroup]);
            $conversation->participants()->attach($isGroup ? [$sender->id, $recipient->id, $muted->id] : [$sender->id, $recipient->id]);
            $url = $isGroup ? route('chat.groups.messages.store', $conversation) : route('chat');
            foreach (['Oi!', 'Tudo bem?'] as $content) {
                $this->actingAs($sender)->postJson($url, ['user_id' => $recipient->id, 'content' => $content])->assertCreated();
            }

            $notifications = DB::table('reader_notifications')->where('conversation_id', $conversation->id)->get();
            $this->assertCount(2, $notifications);
            $this->assertEquals($recipient->id, $notifications[0]->user_id);
            $this->assertEquals('message', $notifications[0]->kind);
            $this->actingAs($recipient)->post(route('notifications.open', $notifications[0]->id))
                ->assertRedirect(route('list', $isGroup ? ['group' => $conversation->id] : ['chat' => $sender->id]));
            $this->assertNotNull(DB::table('reader_notifications')->find($notifications[0]->id)->read_at);
        }

        Event::assertDispatchedTimes(ReaderNotificationCreated::class, 4);
        $this->assertDatabaseMissing('reader_notifications', ['user_id' => $sender->id]);
        $this->assertDatabaseMissing('reader_notifications', ['user_id' => $muted->id]);
    }
}
