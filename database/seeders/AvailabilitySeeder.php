<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Availability;

class AvailabilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $availabilities = [
            'Disponível',
            'Indisponível',
            'Emprestado',
        ];

        foreach ($availabilities as $name) {
            Availability::firstOrCreate(['availability' => $name]);
        }
    }
}
