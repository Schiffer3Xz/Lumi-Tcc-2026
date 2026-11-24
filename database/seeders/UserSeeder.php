<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
            ['email' => 'ramon@aluno.cps.sp.gov.br'],
            [
                'name' => 'ramon',
                'nickname' => 'ramon_user',
                'password' => Hash::make('11111111'),
                'is_admin' => false,
            ]
        );

        // 3. Usuário: Ramon Admin
        User::firstOrCreate(
            ['email' => 'zuluramon09@aluno.cps.sp.gov.br'],
            [
                'name' => 'Ramon Admin',
                'nickname' => 'ramon_admin',
                'password' => Hash::make('11111111'),
                'is_admin' => true,
                'email_verified_at' => now(),
                'first_login' => false,
            ]
        );

        // 4. Usuário: Eduardo Admin
        User::updateOrCreate(
            ['email' => 'eduardo.gomes.d.costa@aluno.cps.sp.gov.br'],
            [
                'name' => 'Eduardo Admin',
                'nickname' => 'edu_admin',
                'password' => Hash::make('outono10'),
                'is_admin' => true,
                'first_login' => false,
                'email_verified_at' => now(),
            ]
        );

        // 5. Usuário: Eddu
        User::firstOrCreate(
            ['email' => 'eddugomescst.dk@aluno.cps.sp.gov.br'],
            [
                'name' => 'Eddu',
                'nickname' => 'eddu_user',
                'password' => Hash::make('11111111'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}