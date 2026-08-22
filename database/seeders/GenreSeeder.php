<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Genre;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Genre::create([
        'name' => 'Ficção',
        ]);

        Genre::create([
            'name' => 'Fantasia',
        ]);

        Genre::create([
            'name' => 'Literatura Brasileira',
        ]);

        Genre::create([
            'name' => 'Ficção Científica',
        ]);

        Genre::create([
            'name' => 'Infantil',
        ]);

        Genre::create([
            'name' => 'Terror',
        ]);
    }
}
