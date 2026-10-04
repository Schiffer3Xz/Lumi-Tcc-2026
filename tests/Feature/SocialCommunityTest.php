<?php

namespace Tests\Feature;

use App\Events\ConversationUpdated;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
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
        Event::fake([MessageSent::class, ConversationUpdated::class]);
        [$sender, $recipient, $stranger] = User::factory()->count(3)->create()->all();
        $response = $this->actingAs($sender)->postJson(route('chat'), [
            'user_id' => $recipient->id, 'content' => 'Uma leitura para você', 'fk_user_id' => $stranger->id,
        ])->assertCreated()->assertJsonPath('message.user_id', $sender->id);
        $this->assertDatabaseHas('messages', [
            'fk_user_id' => $sender->id, 'fk_conversation_id' => $response->json('conversation_id'), 'content' => 'Uma leitura para você',
        ]);
        $this->withoutVite()->get('/social')->assertInertia(fn (Assert $page) => $page
            ->where('directMessages.'.$recipient->id.'.messages.0.user_id', $sender->id));
        $this->actingAs($recipient)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->where('directMessages.'.$sender->id.'.messages.0.content', 'Uma leitura para você'));
        $this->actingAs($stranger)->get('/social')->assertInertia(fn (Assert $page) => $page->has('directMessages', 0));
    }

    public function test_messages_require_authentication_valid_recipient_and_nonempty_content(): void
    {
        Event::fake([MessageSent::class, ConversationUpdated::class]);
        [$reader, $recipient] = User::factory()->count(2)->create()->all();
        $admin = User::factory()->create(['is_admin' => true]);
        $this->postJson(route('chat'), ['user_id' => $recipient->id, 'content' => 'Olá'])->assertUnauthorized();
        $this->actingAs($reader)->postJson(route('chat'), ['user_id' => $reader->id, 'content' => 'Olá'])->assertUnprocessable();
        $this->postJson(route('chat'), ['user_id' => $admin->id, 'content' => 'Olá'])->assertNotFound();
        $this->postJson(route('chat'), ['user_id' => 99999, 'content' => 'Olá'])->assertUnprocessable();
        foreach (['', '  ', str_repeat('a', 5001)] as $content) {
            $this->postJson(route('chat'), ['user_id' => $recipient->id, 'content' => $content])
                ->assertUnprocessable()->assertJsonValidationErrors('content');
        }
        $this->assertDatabaseCount('messages', 0);
        $this->assertDatabaseCount('conversations', 0);
    }

    public function test_message_history_preserves_order_without_exposing_other_conversations(): void
    {
        Event::fake([MessageSent::class, ConversationUpdated::class]);
        [$sender, $recipient, $stranger] = User::factory()->count(3)->create()->all();
        $conversation = Conversation::create(['is_group' => false]);
        $conversation->participants()->attach([$sender->id, $recipient->id]);
        foreach (range(1, 55) as $index) {
            Message::create([
                'fk_user_id' => $sender->id, 'fk_conversation_id' => $conversation->id,
                'content' => 'Mensagem '.$index, 'created_at' => now()->addSeconds($index),
            ]);
        }
        $this->actingAs($stranger)->postJson(route('chat'), ['user_id' => $recipient->id, 'content' => 'Outra conversa'])->assertCreated();
        $this->withoutVite()->actingAs($recipient)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('directMessages.'.$sender->id.'.messages', 55)
            ->where('directMessages.'.$sender->id.'.messages.0.content', 'Mensagem 1')
            ->where('directMessages.'.$sender->id.'.messages.54.content', 'Mensagem 55')
            ->has('directMessages.'.$stranger->id.'.messages', 1));
        $this->actingAs($stranger)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('directMessages', 1)->missing('directMessages.'.$sender->id));
    }

    public function test_inbox_discovers_new_conversations_without_requiring_a_follow(): void
    {
        Event::fake([MessageSent::class, ConversationUpdated::class]);
        [$sender, $recipient, $stranger] = User::factory()->count(3)->create()->all();
        $this->actingAs($sender)->postJson(route('chat'), ['user_id' => $recipient->id, 'content' => 'Primeira'])->assertCreated();
        $this->postJson(route('chat'), ['user_id' => $recipient->id, 'content' => 'Segunda'])->assertCreated();
        $this->assertDatabaseCount('conversations', 1);
        $this->assertDatabaseCount('follows', 0);
        $this->withoutVite()->actingAs($recipient)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('conversationUsers', 1)->where('conversationUsers.0.id', $sender->id)
            ->has('directMessages.'.$sender->id.'.messages', 2));
        $this->actingAs($stranger)->get('/social')->assertInertia(fn (Assert $page) => $page
            ->has('conversationUsers', 0)->has('directMessages', 0));
    }
}
