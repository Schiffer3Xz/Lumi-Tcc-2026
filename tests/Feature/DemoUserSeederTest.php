<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Database\Seeders\DemoUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoUserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_replacement_preserves_activity_and_existing_accounts(): void
    {
        $admin = User::factory()->create(['email' => 'admin@example.com', 'is_admin' => true]);
        $reader = User::factory()->create(['email' => 'reader@school.test']);
        $demo = User::factory()->create(['email' => 'old@example.org', 'is_admin' => false]);
        $post = Post::create(['fk_user_id' => $demo->id, 'content' => 'Post original']);

        $this->seed(DemoUserSeeder::class);

        $this->assertDatabaseCount('users', 7);
        $this->assertSame('eduardo.gomes@example.com', $demo->fresh()->email);
        $this->assertSame($demo->id, $post->fresh()->fk_user_id);
        $this->assertSame('admin@example.com', $admin->fresh()->email);
        $this->assertSame('reader@school.test', $reader->fresh()->email);

        $passwords = User::whereIn('email', array_keys(DemoUserSeeder::READERS))->pluck('password', 'email')->all();
        foreach (DemoUserSeeder::READERS as $email => $name) {
            $this->assertDatabaseHas('users', ['email' => $email, 'name' => $name, 'is_admin' => false, 'first_login' => false]);
            $this->assertNotNull(User::where('email', $email)->firstOrFail()->email_verified_at);
        }

        $demo->fresh()->forceFill(['email_verified_at' => null, 'first_login' => true])->save();
        $this->seed(DemoUserSeeder::class);

        $this->assertDatabaseCount('users', 7);
        $this->assertNotNull($demo->fresh()->email_verified_at);
        $this->assertFalse((bool) $demo->fresh()->first_login);
        $this->assertSame($passwords, User::whereIn('email', array_keys(DemoUserSeeder::READERS))->pluck('password', 'email')->all());
    }
}
