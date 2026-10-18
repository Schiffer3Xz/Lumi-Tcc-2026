<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Author;
use App\Models\Genre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Keep the sample covers available after a fresh checkout without replacing uploaded files.
        foreach (File::files(database_path('seeders/assets/covers')) as $cover) {
            $path = 'covers/'.$cover->getFilename();
            if (! Storage::disk('public')->exists($path)) {
                Storage::disk('public')->put($path, File::get($cover->getPathname()));
            }
        }

        Book::updateOrCreate(['title' => '1984'], [
            'page_count' => 328,
            'publication_year' => 1949,
            'publisher' => 'Secker & Warburg',
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
            'readers_count' => 226,
            'fk_author_id' => 8,
            'fk_genre_id' => 2,
            'fk_availability_id' => 1,
            'description' => 'Percy Jackson descobre que é filho de um deus grego e embarca em uma missão perigosa.',
            'cover_url' => 'covers/PercyJackson.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Novo dicionário da língua portuguesa'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Cândido de Figueiredo'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Cândido de Figueiredo. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/31552',
            'cover_url' => 'covers/gutenberg-31552.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Amor Crioulo: vida argentina'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Abel Acácio de Almeida Botelho'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Abel Acácio de Almeida Botelho. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/24919',
            'cover_url' => 'covers/gutenberg-24919.jpg',
        ]);

        Book::firstOrCreate(['title' => 'A Revolução Portugueza: O 5 de Outubro (Lisboa 1910)'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Francisco Jorge de Abreu'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'História'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Francisco Jorge de Abreu. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/26777',
            'cover_url' => 'covers/gutenberg-26777.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Os Lusíadas'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Luís de Camões'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Poesia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Luís de Camões. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/3333',
            'cover_url' => 'covers/gutenberg-3333.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Da terra à lua, viagem directa em 97 horas e 20 minutos'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Jules Verne'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção Científica'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Jules Verne. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/28341',
            'cover_url' => 'covers/gutenberg-28341.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Memorias Posthumas de Braz Cubas'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Machado de Assis'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Machado de Assis. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/54829',
            'cover_url' => 'covers/gutenberg-54829.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Amor de Salvação'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Camilo Castelo Branco'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Camilo Castelo Branco. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/26988',
            'cover_url' => 'covers/gutenberg-26988.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Contos'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/31347',
            'cover_url' => 'covers/gutenberg-31347.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Obras Completas de Luis de Camões, Tomo II'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Luís de Camões'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Poesia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Luís de Camões. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/31509',
            'cover_url' => 'covers/gutenberg-31509.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Os Maias: episodios da vida romantica'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/40409',
            'cover_url' => 'covers/gutenberg-40409.jpg',
        ]);

        Book::firstOrCreate(['title' => 'A correspondência de Fradique Mendes: memórias e notas'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/27637',
            'cover_url' => 'covers/gutenberg-27637.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Aves Migradoras'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Fialho de Almeida'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Fialho de Almeida. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/22622',
            'cover_url' => 'covers/gutenberg-22622.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Iracema: com uma noticia biographica do auctor'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'José Martiniano de Alencar'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de José Martiniano de Alencar. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/67740',
            'cover_url' => 'covers/gutenberg-67740.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Scenas Contemporaneas'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Camilo Castelo Branco'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Camilo Castelo Branco. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/23203',
            'cover_url' => 'covers/gutenberg-23203.jpg',
        ]);

        Book::firstOrCreate(['title' => 'As Minas de Salomão'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'H. Rider (Henry Rider) Haggard'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Aventura'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de H. Rider (Henry Rider) Haggard. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/22015',
            'cover_url' => 'covers/gutenberg-22015.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Flores do Campo'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'João de Deus'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Poesia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de João de Deus. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/27599',
            'cover_url' => 'covers/gutenberg-27599.jpg',
        ]);

        Book::firstOrCreate(['title' => 'O crime do padre Amaro, scenas da vida devota'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/31971',
            'cover_url' => 'covers/gutenberg-31971.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Alguns homens do meu tempo: impressões litterarias'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Maria Amalia Vaz de Carvalho'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'História'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Maria Amalia Vaz de Carvalho. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/26338',
            'cover_url' => 'covers/gutenberg-26338.jpg',
        ]);

        Book::firstOrCreate(['title' => 'A Lenda da Meia-Noite'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Manuel Pinheiro Chagas'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Manuel Pinheiro Chagas. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/23400',
            'cover_url' => 'covers/gutenberg-23400.jpg',
        ]);

        Book::firstOrCreate(['title' => 'O Cortiço'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Aluísio Azevedo'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Aluísio Azevedo. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/69187',
            'cover_url' => 'covers/gutenberg-69187.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Raios de extincta luz: poesias ineditas (1859-1863)'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Antero de Quental'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Poesia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Antero de Quental. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/20874',
            'cover_url' => 'covers/gutenberg-20874.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Paisagens da China e do Japão'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Wenceslau de Moraes'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Wenceslau de Moraes. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/25537',
            'cover_url' => 'covers/gutenberg-25537.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Contos d\'Aldeia'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Alberto Leal Barradas Monteiro Braga'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Alberto Leal Barradas Monteiro Braga. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/21581',
            'cover_url' => 'covers/gutenberg-21581.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Os Pobres: Precedido de uma Carta-Prefacio de Guerra Junqueiro'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Raul Brandão'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Raul Brandão. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/20841',
            'cover_url' => 'covers/gutenberg-20841.jpg',
        ]);

        Book::firstOrCreate(['title' => 'A Cidade e as Serras'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/18220',
            'cover_url' => 'covers/gutenberg-18220.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Portugal e Brazil: emigração e colonisação'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'D. A. Gomes Pércheiro'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de D. A. Gomes Pércheiro. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/27964',
            'cover_url' => 'covers/gutenberg-27964.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Historias Sem Data'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Machado de Assis'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Machado de Assis. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/33056',
            'cover_url' => 'covers/gutenberg-33056.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Os deputados brasileiros nas Côrtes Geraes de 1821'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Manuel Emílio Gomes de Carvalho'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'História'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Manuel Emílio Gomes de Carvalho. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/24824',
            'cover_url' => 'covers/gutenberg-24824.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Quincas Borba'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Machado de Assis'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Machado de Assis. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/55682',
            'cover_url' => 'covers/gutenberg-55682.jpg',
        ]);

        Book::firstOrCreate(['title' => 'O Primo Bazilio: Episodio Domestico'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/42942',
            'cover_url' => 'covers/gutenberg-42942.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Principios e questões de philosophia politica (Vol. 1 of 2)'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'António Cândido'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de António Cândido. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/71031',
            'cover_url' => 'covers/gutenberg-71031.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Four Plays of Gil Vicente'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Gil Vicente'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Teatro'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Gil Vicente. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/28399',
            'cover_url' => 'covers/gutenberg-28399.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Os Bravos do Mindello: Romance Historico'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Faustino da Fonseca'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Faustino da Fonseca. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/21290',
            'cover_url' => 'covers/gutenberg-21290.jpg',
        ]);

        Book::firstOrCreate(['title' => 'A Velhice do Padre Eterno'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Abílio Manuel Guerra Junqueiro'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Poesia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Abílio Manuel Guerra Junqueiro. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/23526',
            'cover_url' => 'covers/gutenberg-23526.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Nova Sapho: Tragedia Extranha'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Bento de Oliveira Cardoso, Visconde de Villa-Moura'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Bento de Oliveira Cardoso, Visconde de Villa-Moura. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/26371',
            'cover_url' => 'covers/gutenberg-26371.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Pátria'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Abílio Manuel Guerra Junqueiro'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Teatro'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Abílio Manuel Guerra Junqueiro. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/21209',
            'cover_url' => 'covers/gutenberg-21209.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Viriatho: Narrativa epo-historica'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Teófilo Braga'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Teófilo Braga. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/26850',
            'cover_url' => 'covers/gutenberg-26850.jpg',
        ]);

        Book::firstOrCreate(['title' => 'A Illustre Casa de Ramires'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/23145',
            'cover_url' => 'covers/gutenberg-23145.jpg',
        ]);

        Book::firstOrCreate(['title' => 'A Casa dos Fantasmas - Volume II: Episodio do Tempo dos Francezes'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Luiz Augusto Rebello da Silva'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Luiz Augusto Rebello da Silva. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/26605',
            'cover_url' => 'covers/gutenberg-26605.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Triste Fim de Polycarpo Quaresma'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Lima Barreto'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Lima Barreto. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/67535',
            'cover_url' => 'covers/gutenberg-67535.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Cartas de Inglaterra'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Eça de Queirós'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'História'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Eça de Queirós. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/25641',
            'cover_url' => 'covers/gutenberg-25641.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Amor de Perdição: Memorias d\'uma familia'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Camilo Castelo Branco'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Camilo Castelo Branco. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/16425',
            'cover_url' => 'covers/gutenberg-16425.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Transviado'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Jaime de Magalhães Lima'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Jaime de Magalhães Lima. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/25945',
            'cover_url' => 'covers/gutenberg-25945.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Bom-senso e bom-gosto: carta ao excelentissimo senhor Antonio Feliciano de Castilho'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Antero de Quental'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Antero de Quental. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/30070',
            'cover_url' => 'covers/gutenberg-30070.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Obras Completas de Luis de Camões, Tomo III'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Luís de Camões'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Poesia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Luís de Camões. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/37192',
            'cover_url' => 'covers/gutenberg-37192.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Pau brasil : $b Cancioneiro de Oswald de Andrade, prefaciado por Paulo Prado, illuminado por Tarsila'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Oswaldo de Andrade'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Poesia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Oswaldo de Andrade. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/79326',
            'cover_url' => 'covers/gutenberg-79326.jpg',
        ]);

        Book::firstOrCreate(['title' => 'O Guarany: romance brazileiro, Vol. 1 (of 2)'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'José Martiniano de Alencar'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de José Martiniano de Alencar. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/67724',
            'cover_url' => 'covers/gutenberg-67724.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Perolas e Diamantes: Contos Infantis'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'Jacob Grimm; Wilhelm Grimm'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Fantasia'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de Jacob Grimm; Wilhelm Grimm. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/30510',
            'cover_url' => 'covers/gutenberg-30510.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Ubirajara: Lenda Tupi'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'José Martiniano de Alencar'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de José Martiniano de Alencar. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/38496',
            'cover_url' => 'covers/gutenberg-38496.jpg',
        ]);

        Book::firstOrCreate(['title' => 'Memoria sobre a cultura, e productos da cana de assucar'], [
            'page_count' => 0, // Não informado pela edição.
            'publication_year' => null,
            'publisher' => 'Project Gutenberg',
            'readers_count' => 0,
            'fk_author_id' => Author::firstOrCreate(['name' => 'José Caetano Gomes'])->id,
            'fk_genre_id' => Genre::firstOrCreate(['name' => 'Não ficção'])->id,
            'fk_availability_id' => 1,
            'description' => 'Obra de José Caetano Gomes. Edição digital do Project Gutenberg. Fonte: https://www.gutenberg.org/ebooks/25148',
            'cover_url' => 'covers/gutenberg-25148.jpg',
        ]);

    }
}
