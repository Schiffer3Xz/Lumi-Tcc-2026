<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Book::create([
            'title' => '1984',
            'page_count' => 328,
            'fk_author_id' => 1,
            'fk_genre_id' => 1,
            'fk_availability_id' => 1,
            'description' => 'Um clássico distópico sobre um regime totalitário que controla todos os aspectos da sociedade.',
            'cover_url' => 'books/1984.jpg',
        ]);

        Book::create([
            'title' => 'O Hobbit',
            'page_count' => 310,
            'fk_author_id' => 2,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Bilbo Bolseiro embarca em uma aventura inesperada pela Terra-média.',
            'cover_url' => 'books/o-hobbit.jpg',
        ]);

        Book::create([
            'title' => 'Dom Casmurro',
            'page_count' => 256,
            'fk_author_id' => 3,
            'fk_genre_id' => 3,
            'fk_availability_id' => 1,
            'description' => 'Bentinho narra sua vida, seu relacionamento com Capitu e suas dúvidas sobre o passado.',
            'cover_url' => 'books/dom-casmurro.jpg',
        ]);

        Book::create([
            'title' => 'Harry Potter e a Pedra Filosofal',
            'page_count' => 264,
            'fk_author_id' => 4,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Harry Potter descobre que é um bruxo e começa seus estudos em Hogwarts.',
            'cover_url' => 'books/harry-potter-1.jpg',
        ]);

        Book::create([
            'title' => 'O Senhor dos Anéis: A Sociedade do Anel',
            'page_count' => 576,
            'fk_author_id' => 2,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Frodo recebe a missão de levar o Um Anel até Mordor para destruí-lo.',
            'cover_url' => 'books/senhor-dos-aneis.jpg',
        ]);

        Book::create([
            'title' => 'Duna',
            'page_count' => 688,
            'fk_author_id' => 5,
            'fk_genre_id' => 4,
            'fk_availability_id' => 1,
            'description' => 'Paul Atreides é levado a um planeta desértico que possui o recurso mais valioso do universo.',
            'cover_url' => 'books/duna.jpg',
        ]);

        Book::create([
            'title' => 'O Pequeno Príncipe',
            'page_count' => 96,
            'fk_author_id' => 6,
            'fk_genre_id' => 5,
            'fk_availability_id' => 1,
            'description' => 'Uma história sobre amizade, amor, perda e o significado das relações humanas.',
            'cover_url' => 'books/o-pequeno-principe.jpg',
        ]);

        Book::create([
            'title' => 'A Revolução dos Bichos',
            'page_count' => 152,
            'fk_author_id' => 1,
            'fk_genre_id' => 1,
            'fk_availability_id' => 1,
            'description' => 'Animais de uma fazenda se rebelam contra os humanos e assumem o controle do local.',
            'cover_url' => 'books/revolucao-dos-bichos.jpg',
        ]);

        Book::create([
            'title' => 'It: A Coisa',
            'page_count' => 1104,
            'fk_author_id' => 7,
            'fk_genre_id' => 6,
            'fk_availability_id' => 1,
            'description' => 'Um grupo de amigos enfrenta uma entidade assustadora que aterroriza a cidade de Derry.',
            'cover_url' => 'books/it-a-coisa.jpg',
        ]);

        Book::create([
            'title' => 'Percy Jackson e o Ladrão de Raios',
            'page_count' => 400,
            'fk_author_id' => 8,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Percy Jackson descobre que é filho de um deus grego e embarca em uma missão perigosa.',
            'cover_url' => 'books/percy-jackson.jpg',
        ]);
    }
}
