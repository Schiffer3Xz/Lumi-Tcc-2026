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
        Book::updateOrCreate(['title' => '1984'], [
            'page_count' => 328,
            'publication_year' => 1949,
            'publisher' => 'Secker & Warburg',
            'rating' => 4.7,
            'readers_count' => 128,
            'fk_author_id' => 1,
            'fk_genre_id' => 1,
            'fk_availability_id' => 1,
            'description' => 'Um clássico distópico sobre um regime totalitário que controla todos os aspectos da sociedade.',
            'cover_url' => 'covers/1984.jpg',
        ]);

        Book::updateOrCreate(['title' => 'O Hobbit'], [
            'page_count' => 310,
            'publication_year' => 1937,
            'publisher' => 'George Allen & Unwin',
            'rating' => 4.8,
            'readers_count' => 214,
            'fk_author_id' => 2,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Bilbo Bolseiro embarca em uma aventura inesperada pela Terra-média.',
            'cover_url' => 'covers/hobbit.jpg',
        ]);

        Book::updateOrCreate(['title' => 'Dom Casmurro'], [
            'page_count' => 256,
            'publication_year' => 1899,
            'publisher' => 'Livraria Garnier',
            'rating' => 4.5,
            'readers_count' => 176,
            'fk_author_id' => 3,
            'fk_genre_id' => 3,
            'fk_availability_id' => 1,
            'description' => 'Bentinho narra sua vida, seu relacionamento com Capitu e suas dúvidas sobre o passado.',
            'cover_url' => 'covers/DomCasmurro.jpg',
        ]);

        Book::updateOrCreate(['title' => 'Harry Potter e a Pedra Filosofal'], [
            'page_count' => 264,
            'publication_year' => 1997,
            'publisher' => 'Bloomsbury',
            'rating' => 4.9,
            'readers_count' => 302,
            'fk_author_id' => 4,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Harry Potter descobre que é um bruxo e começa seus estudos em Hogwarts.',
            'cover_url' => 'covers/harryPoter.jpg',
        ]);

        Book::updateOrCreate(['title' => 'O Senhor dos Anéis: A Sociedade do Anel'], [
            'page_count' => 576,
            'publication_year' => 1954,
            'publisher' => 'Allen & Unwin',
            'rating' => 4.9,
            'readers_count' => 267,
            'fk_author_id' => 2,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Frodo recebe a missão de levar o Um Anel até Mordor para destruí-lo.',
            'cover_url' => 'covers/senhor.jpg',
        ]);

        Book::updateOrCreate(['title' => 'Duna'], [
            'page_count' => 688,
            'publication_year' => 1965,
            'publisher' => 'Chilton Company',
            'rating' => 4.8,
            'readers_count' => 189,
            'fk_author_id' => 5,
            'fk_genre_id' => 4,
            'fk_availability_id' => 1,
            'description' => 'Paul Atreides é levado a um planeta desértico que possui o recurso mais valioso do universo.',
            'cover_url' => 'covers/duna.jpg',
        ]);

        Book::updateOrCreate(['title' => 'O Pequeno Príncipe'], [
            'page_count' => 96,
            'publication_year' => 1943,
            'publisher' => 'Reynal & Hitchcock',
            'rating' => 4.7,
            'readers_count' => 241,
            'fk_author_id' => 6,
            'fk_genre_id' => 5,
            'fk_availability_id' => 1,
            'description' => 'Uma história sobre amizade, amor, perda e o significado das relações humanas.',
            'cover_url' => 'covers/oPequeno.jpg',
        ]);

        Book::updateOrCreate(['title' => 'A Revolução dos Bichos'], [
            'page_count' => 152,
            'publication_year' => 1945,
            'publisher' => 'Secker & Warburg',
            'rating' => 4.6,
            'readers_count' => 155,
            'fk_author_id' => 1,
            'fk_genre_id' => 1,
            'fk_availability_id' => 1,
            'description' => 'Animais de uma fazenda se rebelam contra os humanos e assumem o controle do local.',
            'cover_url' => 'covers/revolução.jpg',
        ]);

        Book::updateOrCreate(['title' => 'It: A Coisa'], [
            'page_count' => 1104,
            'publication_year' => 1986,
            'publisher' => 'Viking Press',
            'rating' => 4.4,
            'readers_count' => 198,
            'fk_author_id' => 7,
            'fk_genre_id' => 6,
            'fk_availability_id' => 1,
            'description' => 'Um grupo de amigos enfrenta uma entidade assustadora que aterroriza a cidade de Derry.',
            'cover_url' => 'covers/it.jpg',
        ]);

        Book::updateOrCreate(['title' => 'Percy Jackson e o Ladrão de Raios'], [
            'page_count' => 400,
            'publication_year' => 2005,
            'publisher' => 'Disney Hyperion',
            'rating' => 4.8,
            'readers_count' => 226,
            'fk_author_id' => 8,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Percy Jackson descobre que é filho de um deus grego e embarca em uma missão perigosa.',
            'cover_url' => 'covers/PercyJackson.jpg',
        ]);
    }
}
