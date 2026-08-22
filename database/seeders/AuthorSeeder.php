<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Author::create([
        'name' => 'George Orwell',
        ]);

        Author::create([
            'name' => 'J.R.R. Tolkien',
        ]);

        Author::create([
            'name' => 'Machado de Assis',
        ]);

        Author::create([
            'name' => 'J.K. Rowling',
        ]);

        Author::create([
            'name' => 'Frank Herbert',
        ]);

        Author::create([
            'name' => 'Antoine de Saint-Exupéry',
        ]);

        Author::create([
            'name' => 'Stephen King',
        ]);

        Author::create([
            'name' => 'Rick Riordan',
        ]);
    }
}
