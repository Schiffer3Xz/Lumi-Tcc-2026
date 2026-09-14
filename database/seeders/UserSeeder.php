<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash; // Importação recomendada para senhas

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Criar os 5 usuários aleatórios com a estrutura correta
        for ($i = 0; $i < 5; $i++) {
            User::firstOrCreate(
                ['email' => fake()->unique()->safeEmail()],
                [
                    'name' => fake()->name(),
                    'nickname' => fake()->unique()->userName(),
                    'password' => Hash::make('password'),
                    'description' => fake()->sentence(),
                    'profile_photo' => null,
                    'read_books' => fake()->numberBetween(0, 30),
                    'reading_books' => fake()->numberBetween(0, 5),
                    'shelf_books' => fake()->numberBetween(0, 15),
                    'rated_books' => fake()->numberBetween(0, 25),
                    'is_admin' => false,
                ]
            );
        }

        // 2. Usuário: ramon
        User::firstOrCreate(
            ['email' => 'ramon@gmail.com'],
            [
                'name' => 'ramon',
                'nickname' => 'ramon_user', // Evita erro se o campo for obrigatório
                'password' => Hash::make('11111111'), // Corrigido para Bcrypt
                'is_admin' => false,
            ]
        );

        // 3. Usuário: Ramon Admin
        User::firstOrCreate(
            ['email' => 'zuluramon09@gmail.com'],
            [
                'name' => 'Ramon Admin',
                'nickname' => 'ramon_admin',
                'password' => Hash::make('11111111'), // Corrigido para Bcrypt
                'is_admin' => true,
                'email_verified_at' => now(),
                'first_login' => false,
            ]
        );

        // 4. Usuário: Eduardo Admin (com updateOrCreate)
        User::updateOrCreate(
            ['email' => 'eduardo.gomes.d.costa@gmail.com'],
            [
                'name' => 'Eduardo Admin',
                'nickname' => 'edu_admin',
                'password' => Hash::make('outono10'), // Corrigido para Bcrypt
                'is_admin' => true,
                'first_login' => false,
                'email_verified_at' => now(),
            ]
        );

        // 5. Usuário: Eddu
        User::firstOrCreate(
            ['email' => 'eddugomescst.dk@gmail.com'],
            [
                'name' => 'Eddu',
                'nickname' => 'eddu_user',
                'password' => Hash::make('11111111'), // Corrigido para Bcrypt
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
