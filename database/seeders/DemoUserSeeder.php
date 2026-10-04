<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoUserSeeder extends Seeder
{
    public const READERS = [
        'eduardo.gomes@example.com' => 'EDUARDO GOMES DA COSTA',
        'kelly.silva@example.com' => 'KELLY FERNANDA DA SILVA',
        'miguel.pezini@example.com' => 'MIGUEL AUGUSTO PEZINI',
        'paola.souza@example.com' => 'PAOLA DOMINGUES DE SOUZA',
        'ramon.schifferli@example.com' => 'RAMON GUILHERME RAMOS SCHIFFERLI',
    ];

    public function run(): void
    {
        $credentials = DB::transaction(function () {
            $previousReaders = User::where('is_admin', false)
                ->whereNotIn('email', array_keys(self::READERS))
                ->where(function ($query) {
                    foreach (['example.com', 'example.org', 'example.net', 'lumi.example'] as $domain) {
                        $query->orWhere('email', 'like', '%@'.$domain);
                    }
                })->orderBy('id')->get();

            $credentials = [];
            foreach (self::READERS as $email => $name) {
                $user = User::where('email', $email)->first();
                if ($user) {
                    $user->forceFill([
                        'email_verified_at' => $user->email_verified_at ?? now(),
                        'first_login' => false,
                    ])->save();
                    continue;
                }

                // Reuse each demonstration profile's ID to preserve its activity.
                $user = $previousReaders->shift() ?? new User;
                $password = Str::password(16, symbols: false);
                $user->forceFill([
                    'name' => $name,
                    'email' => $email,
                    'nickname' => Str::before($email, '@'),
                    'description' => 'Perfil de demonstração do clube de leitura.',
                    'password' => Hash::make($password),
                    'is_admin' => false,
                    'first_login' => false,
                    'email_verified_at' => now(),
                    'remember_token' => null,
                ])->save();
                DB::table('sessions')->where('user_id', $user->id)->delete();
                $credentials[] = [$name, $email, $password];
            }

            return $credentials;
        });

        if ($credentials && $this->command) {
            $this->command->table(['Nome', 'Login', 'Senha'], $credentials);
        }
    }
}
