<?php

namespace Tests\Feature;

use App\Events\ConversationUpdated;
use App\Events\GroupUpdated;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ChatRealtimeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Event::fake([ConversationUpdated::class, GroupUpdated::class, MessageSent::class]);
    }

    public function test_first_and_subsequent_messages_notify_both_inboxes_without_exposing_content(): void
    {
        [$sender, $recipient] = User::factory()->count(2)->create()->all();
        foreach (['First message', 'Second message'] as $content) {
            $response = $this->actingAs($sender)->postJson(route('chat'), ['user_id' => $recipient->id, 'content' => $content])
                ->assertCreated();
        }
        $id = $response->json('conversation_id');
        Event::assertDispatchedTimes(ConversationUpdated::class, 2);
        Event::assertDispatched(ConversationUpdated::class, fn ($event) => $event->broadcastWith() === [
            'conversationId' => $id, 'removedUserId' => null, 'deleted' => false,
        ] && $this->channelNames($event) === ["private-chat.user.{$sender->id}", "private-chat.user.{$recipient->id}"]);
    }

    public function test_group_creation_notifies_all_invited_readers_and_group_messages_refresh_their_inboxes(): void
    {
        [$owner, $first, $second] = User::factory()->count(3)->create()->all();
        $this->actingAs($owner)->post(route('chat.groups.store'), [
            'name' => 'Readers', 'participants' => [$first->id, $second->id],
        ])->assertRedirect();
        $group = Conversation::sole();
        $this->actingAs($first)->postJson(route('chat.groups.messages.store', $group), ['content' => 'Hello'])->assertCreated();
        Event::assertDispatchedTimes(ConversationUpdated::class, 2);
        Event::assertDispatched(ConversationUpdated::class, fn ($event) => $event->conversationId === $group->id
            && $this->channelNames($event) === ["private-chat.user.{$owner->id}", "private-chat.user.{$first->id}", "private-chat.user.{$second->id}"]);
    }

    public function test_group_removal_notifies_the_removed_reader_and_future_messages_exclude_them(): void
    {
        [$owner, $member, $other] = User::factory()->count(3)->create()->all();
        $group = Conversation::create(['name' => 'Readers', 'is_group' => true, 'created_by' => $owner->id]);
        $group->participants()->attach([$owner->id, $member->id, $other->id]);
        $this->actingAs($owner)->deleteJson(route('chat.groups.participants.destroy', [$group, $member]))->assertNoContent();
        Event::assertDispatched(ConversationUpdated::class, fn ($event) => $event->removedUserId === $member->id
            && in_array("private-chat.user.{$member->id}", $this->channelNames($event), true));
        $this->postJson(route('chat.groups.messages.store', $group), ['content' => 'Members only'])->assertCreated();
        Event::assertDispatched(ConversationUpdated::class, fn ($event) => $event->removedUserId === null
            && $this->channelNames($event) === ["private-chat.user.{$owner->id}", "private-chat.user.{$other->id}"]);
    }

    public function test_group_deletion_notifies_previous_members_even_after_the_group_is_gone(): void
    {
        [$owner, $member] = User::factory()->count(2)->create()->all();
        $group = Conversation::create(['name' => 'Readers', 'is_group' => true, 'created_by' => $owner->id]);
        $group->participants()->attach([$owner->id, $member->id]);
        $this->actingAs($owner)->deleteJson(route('chat.groups.destroy', $group))->assertNoContent();
        Event::assertDispatched(ConversationUpdated::class, fn ($event) => $event->deleted
            && $event->conversationId === $group->id && count($event->broadcastOn()) === 2);
    }

    public function test_private_inbox_authorization_rejects_other_readers_admins_and_guests(): void
    {
        config([
            'broadcasting.default' => 'reverb',
            'broadcasting.connections.reverb.key' => 'test-key',
            'broadcasting.connections.reverb.secret' => 'test-secret',
            'broadcasting.connections.reverb.app_id' => 'test-app',
        ]);
        // Channel callbacks were registered on the default log broadcaster
        // during boot; register them on the Reverb driver used by this test.
        require base_path('routes/channels.php');
        [$reader, $other] = User::factory()->count(2)->create()->all();
        $admin = User::factory()->create(['is_admin' => true]);
        $payload = ['socket_id' => '123.456', 'channel_name' => "private-chat.user.{$reader->id}"];
        $this->postJson('/broadcasting/auth', $payload)->assertForbidden();
        $this->actingAs($reader)->postJson('/broadcasting/auth', $payload)->assertOk()->assertJsonStructure(['auth']);
        $this->actingAs($other)->postJson('/broadcasting/auth', $payload)->assertForbidden();
        $this->actingAs($admin)->postJson('/broadcasting/auth', [
            ...$payload, 'channel_name' => "private-chat.user.{$admin->id}",
        ])->assertForbidden();
    }

    private function channelNames(ConversationUpdated $event): array
    {
        return array_map(fn ($channel) => $channel->name, $event->broadcastOn());
    }
}
