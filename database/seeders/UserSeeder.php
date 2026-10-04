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
        $this->call(DemoUserSeeder::class);

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
