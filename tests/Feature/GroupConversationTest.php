<?php

namespace Tests\Feature;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GroupConversationTest extends TestCase
{
    use RefreshDatabase;

    public function test_group_is_created_with_its_creator_and_selected_readers(): void
    {
        $creator = User::factory()->create();
        $members = User::factory()->count(2)->create();
        $this->actingAs($creator)->post(route('chat.groups.store'), [
            'name' => 'Clube de leitura', 'participants' => $members->modelKeys(),
        ])->assertRedirect(route('list', ['group' => 1]));

        $group = Conversation::sole();
        $this->assertTrue($group->is_group);
        $this->assertEquals($creator->id, $group->created_by);
        $this->assertSame('Clube de leitura', $group->name);
        $this->assertEqualsCanonicalizing([$creator->id, ...$members->modelKeys()], $group->participants->modelKeys());
        $this->assertDatabaseCount('messages', 0);
    }

    public function test_group_members_and_names_are_validated_without_creating_partial_groups(): void
    {
        $creator = User::factory()->create();
        $members = User::factory()->count(2)->create();
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($creator);
        foreach ([[], [$members[0]->id], [$members[0]->id, $members[0]->id], [$creator->id, $members[0]->id], [$admin->id, $members[0]->id], [99999, $members[0]->id]] as $ids) {
            $this->postJson(route('chat.groups.store'), ['name' => 'Grupo', 'participants' => $ids])->assertUnprocessable();
        }
        foreach (['', '   ', str_repeat('a', 101)] as $name) {
            $this->postJson(route('chat.groups.store'), ['name' => $name, 'participants' => $members->modelKeys()])
                ->assertUnprocessable()->assertJsonValidationErrors('name');
        }
        $this->assertDatabaseCount('conversations', 0);
        $this->assertDatabaseCount('conversation_users', 0);
    }

    public function test_only_members_can_send_and_see_group_messages(): void
    {
        Event::fake([MessageSent::class]);
        $members = User::factory()->count(3)->create();
        $stranger = User::factory()->create();
        $group = Conversation::create(['name' => 'Leitores', 'is_group' => true]);
        $group->participants()->attach($members->modelKeys());

        $this->actingAs($members[0])->postJson(route('chat.groups.messages.store', $group), [
            'content' => 'Olá, grupo!', 'fk_user_id' => $stranger->id,
        ])->assertCreated()->assertJsonPath('message.user_id', $members[0]->id)->assertJsonPath('conversation_id', $group->id);
        Event::assertDispatched(MessageSent::class, fn ($event) => $event->message->fk_conversation_id === $group->id
            && $event->broadcastOn()[0]->name === 'private-conversation.'.$group->id.'.user.'.$members[0]->id);

        $this->withoutVite()->actingAs($members[1])->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('groupConversations', 1)->has('groupConversations.0.participants', 3)
            ->where('groupConversations.0.messages.0.content', 'Olá, grupo!')->has('directMessages', 0));

        $this->actingAs($stranger)->postJson(route('chat.groups.messages.store', $group), ['content' => 'Invasão'])->assertForbidden();
        $this->get('/social?group='.$group->id)->assertInertia(fn (Assert $page) => $page->has('groupConversations', 0)->has('directMessages', 0));
        $this->assertDatabaseCount('messages', 1);
    }

    public function test_direct_messages_do_not_reuse_or_leak_into_a_shared_group(): void
    {
        Event::fake([MessageSent::class]);
        $members = User::factory()->count(3)->create();
        $group = Conversation::create(['name' => 'Grupo', 'is_group' => true]);
        $group->participants()->attach($members->modelKeys());

        $first = $this->actingAs($members[0])->postJson(route('chat'), ['user_id' => $members[1]->id, 'content' => 'Mensagem privada'])->assertCreated();
        $directId = $first->json('conversation_id');
        $this->assertNotEquals($group->id, $directId);
        $this->postJson(route('chat'), ['user_id' => $members[1]->id, 'content' => 'Outra mensagem'])->assertCreated()->assertJsonPath('conversation_id', $directId);
        $this->assertDatabaseCount('conversations', 2);
        $this->postJson(route('chat.groups.messages.store', $directId), ['content' => 'Inválida'])->assertNotFound();

        $this->withoutVite()->actingAs($members[1])->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('groupConversations.0.messages', 0)
            ->has('directMessages.'.$members[0]->id.'.messages', 2));
        $this->actingAs($members[2])->get('/social')->assertInertia(fn (Assert $page) => $page->has('directMessages', 0));
    }

    public function test_chat_requires_authentication_and_valid_message_content(): void
    {
        Event::fake([MessageSent::class]);
        $user = User::factory()->create();
        $group = Conversation::create(['name' => 'Grupo', 'is_group' => true]);
        $group->participants()->attach($user->id);
        $this->postJson(route('chat.groups.store'), [])->assertUnauthorized();
        $this->postJson(route('chat.groups.messages.store', $group), ['content' => 'Olá'])->assertUnauthorized();

        $this->actingAs($user);
        foreach (['', '   ', str_repeat('a', 5001)] as $content) {
            $this->postJson(route('chat.groups.messages.store', $group), ['content' => $content])
                ->assertUnprocessable()->assertJsonValidationErrors('content');
        }
        $this->postJson(route('chat'), ['user_id' => (string) $user->id, 'content' => 'Olá'])->assertUnprocessable();
        $this->assertDatabaseCount('messages', 0);
    }
}
