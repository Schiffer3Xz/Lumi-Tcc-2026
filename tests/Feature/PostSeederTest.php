<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Database\Seeders\AuthorSeeder;
use Database\Seeders\AvailabilitySeeder;
use Database\Seeders\BookSeeder;
use Database\Seeders\GenreSeeder;
use Database\Seeders\PostSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_sample_feed_is_reproducible_without_existing_demo_readers(): void
    {
        Storage::fake('public');
        $realReader = User::factory()->create(['email' => 'reader@school.test']);
        $realPost = Post::create(['fk_user_id' => $realReader->id, 'content' => 'Post original']);
        $this->seed([AvailabilitySeeder::class, AuthorSeeder::class, GenreSeeder::class, BookSeeder::class, PostSeeder::class]);

        $this->assertDatabaseCount('posts', 11);
        $this->assertDatabaseCount('post_likes', 29);
        $this->assertDatabaseCount('post_comments', 20);
        $photos = Post::whereNotNull('media_url')->pluck('media_url');
        $this->assertCount(5, $photos);
        foreach ($photos as $photo) {
            Storage::disk('public')->assertExists($photo);
        }
        $this->assertSame(1, Post::where('fk_user_id', $realReader->id)->count());

        Storage::disk('public')->put('covers/1984.jpg', 'custom cover');
        $this->seed([BookSeeder::class, PostSeeder::class]);
        $this->assertDatabaseCount('posts', 11);
        $this->assertDatabaseCount('post_likes', 29);
        $this->assertDatabaseCount('post_comments', 20);
        $this->assertDatabaseCount('users', 6);
        $this->assertSame('Post original', $realPost->fresh()->content);
        $this->assertSame('custom cover', Storage::disk('public')->get('covers/1984.jpg'));
    }
}
