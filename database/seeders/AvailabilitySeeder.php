<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            1 => 'Disponível',
            2 => 'Indisponível',
            3 => 'Emprestado',
        ];

        foreach ($availabilities as $id => $name) {
            Availability::updateOrCreate(
                ['id' => $id],
                ['availability' => $name]
            );
        }
    }
}
