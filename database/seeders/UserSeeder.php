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
            User::firstOrCreate([
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

        User::firstOrCreate([
            'name' => 'ramon',
            'email' => 'ramon@gmail.com',
            'password' => 11111111,
        ]);

        User::firstOrCreate([
            'name' => 'Ramon Admin',
            'email' => 'zuluramon09@gmail.com',
            'password' => 11111111,
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        User::firstOrCreate([
            'name' => 'Eduardo Admin',
            'email' => 'eduar.gomes.d.costa@gmail.com',
            'password' => 11111111,
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        User::firstOrCreate([
            'name' => 'Eddu',
            'email' => 'eddugomescst.dk@gmail.com',
            'password' => 11111111,
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);
    }
}
