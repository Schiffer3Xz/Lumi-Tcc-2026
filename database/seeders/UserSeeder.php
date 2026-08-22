<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 5; $i++) {
            User::create([
                'name' => fake()->name(),
                'nickname' => fake()->unique()->userName(),
                'email' => fake()->unique()->safeEmail(),
                'password' => bcrypt('password'),
                'description' => fake()->sentence(),
                'profile_photo' => null,
                'read_books' => fake()->numberBetween(0, 30),
                'reading_books' => fake()->numberBetween(0, 5),
                'shelf_books' => fake()->numberBetween(0, 15),
                'rated_books' => fake()->numberBetween(0, 25),
                'is_admin' => false,
            ]);
        }
    }
}
