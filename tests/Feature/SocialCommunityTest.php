<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SocialCommunityTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_profile_does_not_expose_private_account_fields(): void
    {
        $reader = User::factory()->create();
        $other = User::factory()->create();
        $this->withoutVite()->actingAs($reader)->get('/people/'.$other->id)
            ->assertInertia(fn (Assert $page) => $page
                ->where('targetUser.id', $other->id)->where('targetUser.name', $other->name)
                ->missing('targetUser.email')->missing('targetUser.password')
                ->missing('targetUser.remember_token')->missing('targetUser.social_notifications'));
    }

    public function test_reader_can_follow_multiple_people_and_each_person_can_have_multiple_followers(): void
    {
        $reader = User::factory()->create();
        $first = User::factory()->create();
        $second = User::factory()->create();
        $third = User::factory()->create();
        $this->actingAs($reader)->from('/social')->post('/people/'.$first->id.'/follow')->assertRedirect('/social');
        $this->post('/people/'.$second->id.'/follow')->assertRedirect('/social');
        $this->post('/people/'.$first->id.'/follow')->assertRedirect('/social');
        $this->actingAs($third)->post('/people/'.$first->id.'/follow')->assertRedirect();
        $this->assertDatabaseCount('follows', 3);
        $this->withoutVite()->actingAs($reader)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('followedUsers', 2)->where('followedUsers.0.isFollowing', true)
            ->has('suggestedUsers', 1)->where('suggestedUsers.0.id', $third->id));
        $this->delete('/people/'.$first->id.'/follow')->assertRedirect('/social');
        $this->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('followedUsers', 1)->where('followedUsers.0.id', $second->id)->has('suggestedUsers', 2));
        $this->assertDatabaseHas('follows', ['fk_follower_id' => $third->id, 'fk_followed_id' => $first->id]);
    }

    public function test_suggestions_exclude_self_admin_and_followed_readers_and_search_has_all_readers(): void
    {
        $reader = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(7)->create();
        $this->withoutVite()->actingAs($reader)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('suggestedUsers', 5)->has('allUsers', 7)
            ->where('allUsers', fn ($users) => collect($users)->every(fn ($user) => ! in_array($user['id'], [$reader->id, $admin->id])))
            ->missing('allUsers.0.email')->missing('allUsers.0.password'));
        $this->post('/people/'.$reader->id.'/follow')->assertStatus(422);
        $this->post('/people/'.$admin->id.'/follow')->assertNotFound();
        $this->post('/people/99999/follow')->assertNotFound();
    }

    public function test_trending_posts_rank_recent_interactions_and_ignore_old_activity(): void
    {
        $author = User::factory()->create();
        $viewer = User::factory()->create();
        $popular = Post::create(['fk_user_id' => $author->id, 'content' => 'Popular']);
        $lessPopular = Post::create(['fk_user_id' => $author->id, 'content' => 'Menos popular']);
        $old = Post::create(['fk_user_id' => $author->id, 'content' => 'Antigo']);
        foreach ([$popular, $lessPopular] as $post) {
            DB::table('post_likes')->insert(['post_id' => $post->id, 'user_id' => $viewer->id, 'created_at' => now(), 'updated_at' => now()]);
        }
        $popular->comments()->create(['user_id' => $viewer->id, 'content' => 'Gostei']);
        DB::table('post_likes')->insert(['post_id' => $old->id, 'user_id' => $viewer->id, 'created_at' => now()->subDays(8), 'updated_at' => now()->subDays(8)]);
        $this->withoutVite()->actingAs($viewer)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('trendingPosts', 2)->where('trendingPosts.0.id', $popular->id)
            ->where('trendingPosts.0.interactions', 2)->where('trendingPosts.1.id', $lessPopular->id));
    }

    public function test_private_messages_are_persistent_and_only_participants_can_see_them(): void
    {
        $sender = User::factory()->create();
        $recipient = User::factory()->create();
        $stranger = User::factory()->create();
        $this->actingAs($sender)->postJson('/messages/'.$recipient->id, ['content' => 'Uma leitura para você', 'sender_id' => $stranger->id])->assertCreated();
        $this->assertDatabaseHas('direct_messages', ['sender_id' => $sender->id, 'recipient_id' => $recipient->id, 'content' => 'Uma leitura para você']);
        $this->getJson('/messages/'.$recipient->id)->assertOk()->assertJsonCount(1, 'messages');
        $this->actingAs($recipient)->getJson('/messages/'.$sender->id)->assertOk()
            ->assertJsonPath('messages.0.content', 'Uma leitura para você')->assertJsonPath('messages.0.sender_id', $sender->id);
        $this->actingAs($stranger)->getJson('/messages/'.$recipient->id)->assertOk()->assertJsonCount(0, 'messages');
        $this->getJson('/messages/'.$sender->id)->assertOk()->assertJsonCount(0, 'messages');
    }

    public function test_messages_require_authentication_valid_recipient_and_nonempty_content(): void
    {
        $reader = User::factory()->create();
        $recipient = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);
        $this->getJson('/messages/'.$recipient->id)->assertUnauthorized();
        $this->postJson('/messages/'.$recipient->id, ['content' => 'Olá'])->assertUnauthorized();
        $this->postJson('/messages/'.$recipient->id.'/read', ['through' => 1])->assertUnauthorized();
        $this->actingAs($reader)->postJson('/messages/'.$reader->id, ['content' => 'Olá'])->assertStatus(422);
        $this->postJson('/messages/'.$admin->id, ['content' => 'Olá'])->assertNotFound();
        $this->postJson('/messages/99999', ['content' => 'Olá'])->assertNotFound();
        foreach (['', '  ', str_repeat('a', 2001)] as $content) {
            $this->postJson('/messages/'.$recipient->id, ['content' => $content])->assertUnprocessable()->assertJsonValidationErrors('content');
        }
        $this->assertDatabaseCount('direct_messages', 0);
    }

    public function test_message_history_is_paginated_without_exposing_other_conversations(): void
    {
        $sender = User::factory()->create();
        $recipient = User::factory()->create();
        $stranger = User::factory()->create();
        foreach (range(1, 55) as $index) {
            DB::table('direct_messages')->insert(['sender_id' => $sender->id, 'recipient_id' => $recipient->id, 'content' => 'Mensagem '.$index, 'created_at' => now(), 'updated_at' => now()]);
        }
        $this->actingAs($stranger)->postJson('/messages/'.$recipient->id, ['content' => 'Outra conversa']);
        $response = $this->actingAs($recipient)->getJson('/messages/'.$sender->id)->assertOk()
            ->assertJsonCount(50, 'messages')->assertJsonPath('hasOlder', true)
            ->assertJsonPath('messages.0.content', 'Mensagem 6')->assertJsonPath('messages.49.content', 'Mensagem 55');
        $this->getJson('/messages/'.$sender->id.'?before='.$response->json('messages.0.id'))
            ->assertOk()->assertJsonCount(5, 'messages')->assertJsonPath('hasOlder', false)->assertJsonPath('messages.0.content', 'Mensagem 1');
    }

    public function test_inbox_shows_unread_messages_and_read_action_only_marks_received_messages_through_cursor(): void
    {
        $sender = User::factory()->create();
        $recipient = User::factory()->create();
        $stranger = User::factory()->create();
        $this->actingAs($sender)->postJson('/messages/'.$recipient->id, ['content' => 'Primeira']);
        $first = DB::table('direct_messages')->value('id');
        $this->postJson('/messages/'.$recipient->id, ['content' => 'Segunda']);
        $second = DB::table('direct_messages')->max('id');
        $this->postJson('/messages/'.$recipient->id.'/read', ['through' => $second])->assertNoContent();
        $this->assertDatabaseHas('direct_messages', ['id' => $first, 'read_at' => null]);
        $this->withoutVite()->actingAs($recipient)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('conversationUsers', 1)->where('conversationUsers.0.id', $sender->id)->where('conversationUsers.0.unreadMessages', 2));
        $this->postJson('/messages/'.$sender->id.'/read', ['through' => $first])->assertNoContent();
        $this->assertNotNull(DB::table('direct_messages')->where('id', $first)->value('read_at'));
        $this->assertDatabaseHas('direct_messages', ['id' => $second, 'read_at' => null]);
        $this->get('/social')->assertInertia(fn (Assert $page) => $page->where('conversationUsers.0.unreadMessages', 1));
        $this->actingAs($stranger)->get('/social')->assertInertia(fn (Assert $page) => $page->has('conversationUsers', 0));
    }
}
