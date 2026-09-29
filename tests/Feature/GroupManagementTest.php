<?php

namespace Tests\Feature;

use App\Events\GroupUpdated;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GroupManagementTest extends TestCase
{
    use RefreshDatabase;

    private function group(User $owner, array $members): Conversation
    {
        $group = Conversation::create(['name' => 'Leitores', 'is_group' => true, 'created_by' => $owner->id]);
        $group->participants()->attach([$owner->id, ...$members]);

        return $group;
    }

    public function test_owner_can_remove_a_member_and_keep_their_message_history(): void
    {
        Event::fake([GroupUpdated::class, MessageSent::class]);
        [$owner, $member, $other] = User::factory()->count(3)->create()->all();
        $group = $this->group($owner, [$member->id, $other->id]);
        $message = Message::create(['fk_user_id' => $member->id, 'fk_conversation_id' => $group->id, 'content' => 'Olá']);
        $queuedMessage = new MessageSent($message);

        $this->actingAs($owner)->deleteJson(route('chat.groups.participants.destroy', [$group, $member]))->assertNoContent();
        $this->assertDatabaseMissing('conversation_users', ['fk_conversation_id' => $group->id, 'fk_user_id' => $member->id]);
        $this->assertDatabaseHas('messages', ['id' => $message->id]);
        $this->assertCount(2, $queuedMessage->broadcastOn());
        $this->assertNotContains('private-conversation.'.$group->id.'.user.'.$member->id,
            array_map(fn ($channel) => $channel->name, $queuedMessage->broadcastOn()));
        Event::assertDispatched(GroupUpdated::class, fn ($event) => $event->removedUserId === $member->id && !$event->deleted);

        $this->withoutVite()->get('/social')->assertInertia(fn (Assert $page) => $page
            ->where('groupConversations.0.can_manage', true)
            ->has('groupConversations.0.participants', 2)
            ->where('groupConversations.0.messages.0.user_name', $member->name));
        $this->actingAs($member)->postJson(route('chat.groups.messages.store', $group), ['content' => 'Outra'])->assertForbidden();
        $this->get('/social')->assertInertia(fn (Assert $page) => $page->has('groupConversations', 0));
    }

    public function test_members_and_outsiders_cannot_manage_the_group(): void
    {
        [$owner, $member, $outsider] = User::factory()->count(3)->create()->all();
        $group = $this->group($owner, [$member->id]);
        foreach ([$member, $outsider] as $user) {
            $this->actingAs($user)->deleteJson(route('chat.groups.destroy', $group))->assertForbidden();
            $this->deleteJson(route('chat.groups.participants.destroy', [$group, $owner]))->assertForbidden();
        }
        $this->assertDatabaseCount('conversations', 1);
        $this->assertDatabaseCount('conversation_users', 2);
        $this->withoutVite()->actingAs($member)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->where('groupConversations.0.can_manage', false));
    }

    public function test_owner_cannot_be_removed_and_other_conversations_are_not_affected(): void
    {
        Event::fake([GroupUpdated::class]);
        [$owner, $member, $outsider] = User::factory()->count(3)->create()->all();
        $group = $this->group($owner, [$member->id]);
        $this->actingAs($owner)->deleteJson(route('chat.groups.participants.destroy', [$group, $owner]))->assertUnprocessable();
        $this->deleteJson(route('chat.groups.participants.destroy', [$group, $outsider]))->assertNotFound();
        $direct = Conversation::create(['is_group' => false]);
        $direct->participants()->attach([$owner->id, $member->id]);
        $this->deleteJson(route('chat.groups.destroy', $direct))->assertNotFound();
        $this->deleteJson(route('chat.groups.participants.destroy', [$direct, $member]))->assertNotFound();

        $this->deleteJson(route('chat.groups.participants.destroy', [$group, $member]))->assertNoContent();
        $this->assertDatabaseHas('conversation_users', ['fk_conversation_id' => $direct->id, 'fk_user_id' => $member->id]);
        $this->withoutVite()->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('groupConversations', 1)->has('groupConversations.0.participants', 1));
    }

    public function test_deleting_a_group_removes_only_its_messages_and_memberships(): void
    {
        Event::fake([GroupUpdated::class]);
        [$owner, $member] = User::factory()->count(2)->create()->all();
        $group = $this->group($owner, [$member->id]);
        $other = $this->group($owner, [$member->id]);
        $message = Message::create(['fk_user_id' => $owner->id, 'fk_conversation_id' => $group->id, 'content' => 'Apagar']);
        $kept = Message::create(['fk_user_id' => $owner->id, 'fk_conversation_id' => $other->id, 'content' => 'Manter']);
        $queued = new MessageSent($message);

        $this->actingAs($owner)->deleteJson(route('chat.groups.destroy', $group))->assertNoContent();
        $this->assertDatabaseMissing('conversations', ['id' => $group->id]);
        $this->assertDatabaseMissing('conversation_users', ['fk_conversation_id' => $group->id]);
        $this->assertDatabaseMissing('messages', ['id' => $message->id]);
        $this->assertDatabaseHas('messages', ['id' => $kept->id]);
        $this->assertCount(2, $other->participants);
        $this->assertSame([], $queued->broadcastOn());
        Event::assertDispatched(GroupUpdated::class, fn ($event) => $event->conversationId === $group->id && $event->deleted);
        $this->withoutVite()->actingAs($member)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('groupConversations', 1)->where('groupConversations.0.id', $other->id));
    }

    public function test_management_requires_authentication(): void
    {
        [$owner, $member] = User::factory()->count(2)->create()->all();
        $group = $this->group($owner, [$member->id]);
        $this->deleteJson(route('chat.groups.destroy', $group))->assertUnauthorized();
        $this->deleteJson(route('chat.groups.participants.destroy', [$group, $member]))->assertUnauthorized();
    }

}
