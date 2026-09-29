<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class GroupOwnershipMigrationTest extends TestCase
{
    use DatabaseMigrations;

    public function test_existing_groups_use_the_first_added_participant_as_creator(): void
    {
        $migration = require database_path('migrations/2026_09_26_000003_add_created_by_to_conversations.php');
        $migration->down();

        [$member, $owner] = User::factory()->count(2)->create()->all();
        $group = Conversation::create(['name' => 'Grupo existente', 'is_group' => true]);
        $group->participants()->attach([$owner->id, $member->id]);
        $direct = Conversation::create(['is_group' => false]);
        $direct->participants()->attach([$member->id, $owner->id]);
        $migration->up();

        $this->assertEquals($owner->id, $group->fresh()->created_by);
        $this->assertNull($direct->fresh()->created_by);
        $this->assertDatabaseCount('conversation_users', 4);
    }
}
