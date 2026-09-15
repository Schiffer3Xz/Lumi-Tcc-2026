<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $publications = [
            '1984' => 'Comecei 1984 e já fiquei pensando em como a vigilância muda o jeito de agir das pessoas. A atmosfera é pesada, mas dá muita vontade de continuar. Quem está lendo também?',
            'O Hobbit' => 'O Hobbit é uma ótima companhia para quem quer embarcar em uma aventura. Gosto de como Bilbo precisa sair da sua rotina e descobrir uma coragem que nem sabia que tinha. Qual personagem vocês mais gostam?',
            'Dom Casmurro' => 'Dom Casmurro rende uma conversa enorme sobre memória e ponto de vista. O mais interessante, para mim, é perceber que conhecemos tudo pela versão do Bentinho. Vocês confiam nesse narrador?',
            'Harry Potter e a Pedra Filosofal' => 'Voltar ao começo de Harry Potter e a Pedra Filosofal é reencontrar aquela sensação de descobrir um mundo novo. As amizades em Hogwarts são minha parte favorita. Em qual casa vocês gostariam de estudar?',
            'O Senhor dos Anéis: A Sociedade do Anel' => 'A Sociedade do Anel me faz querer acompanhar cada passo da viagem. Além da aventura, gosto muito da amizade e da responsabilidade que os personagens dividem. Quem mais está explorando a Terra-média?',
            'Duna' => 'Duna entrou na minha lista de leituras que pedem atenção aos detalhes. Arrakis, a disputa por recursos e as relações de poder deixam o universo muito interessante. Estou lendo devagar para aproveitar a construção desse mundo.',
            'O Pequeno Príncipe' => 'O Pequeno Príncipe é curto, mas sempre deixa alguma coisa para pensar. Desta vez, fiquei com as reflexões sobre amizade, cuidado e o tempo que dedicamos aos outros. É um livro que vocês também gostam de reler?',
            'A Revolução dos Bichos' => 'A Revolução dos Bichos me chamou a atenção pela forma como uma história aparentemente simples abre espaço para discutir poder e desigualdade. Acho uma boa escolha para uma roda de leitura. Quem toparia conversar sobre ele?',
            'It: A Coisa' => 'It: A Coisa está na minha lista para quem gosta de terror com uma história longa e cheia de personagens. O contraste entre amizade e medo me chama bastante a atenção. Vocês preferem ler terror de dia ou à noite?',
            'Percy Jackson e o Ladrão de Raios' => 'Percy Jackson e o Ladrão de Raios mistura mitologia grega, aventura e humor de um jeito muito divertido. Fiquei com vontade de pesquisar mais sobre os deuses depois de ler. Qual figura da mitologia vocês acham mais interessante?',
        ];

        $commentsByBook = [
            '1984' => [
                'Também comecei! A sensação de estar sendo observado aparece em cada detalhe.',
                'Acho uma ótima escolha para discutir liberdade e informação no clube de leitura.',
            ],
            'O Hobbit' => [
                'O Bilbo é meu favorito. É muito legal acompanhar como ele ganha confiança.',
                'Esse livro me deu vontade de conhecer mais histórias da Terra-média!',
            ],
            'Dom Casmurro' => [
                'Eu leio desconfiando do Bentinho. A forma como ele escolhe contar os fatos faz diferença.',
                'Esse debate renderia uma roda de conversa inteira. Quero ouvir outras interpretações!',
            ],
            'Harry Potter e a Pedra Filosofal' => [
                'Eu iria de Corvinal! A descoberta de Hogwarts é uma das minhas partes favoritas.',
                'As cenas de amizade deixam a leitura ainda melhor. Já coloquei na minha estante.',
            ],
            'O Senhor dos Anéis: A Sociedade do Anel' => [
                'A amizade entre os personagens é o que mais me prende nessa jornada.',
                'Estou lendo aos poucos e acompanhando o mapa. Ajuda muito a imaginar a viagem!',
            ],
            'Duna' => [
                'Também prefiro ler com calma. Sempre aparece um detalhe novo sobre Arrakis.',
                'A relação entre o ambiente e as disputas de poder rende uma discussão muito boa.',
            ],
            'O Pequeno Príncipe' => [
                'Gosto de reler porque cada vez presto atenção em uma coisa diferente.',
                'As reflexões sobre amizade ficam comigo mesmo depois de terminar o livro.',
            ],
            'A Revolução dos Bichos' => [
                'Eu topo a roda de leitura! Podemos conversar sobre como as regras vão mudando.',
                'É uma leitura curta que deixa bastante assunto para discutir depois.',
            ],
            'It: A Coisa' => [
                'Terror para mim só de dia! Mas a curiosidade sempre me faz continuar mais um capítulo.',
                'Gosto quando o terror também dá espaço para desenvolver as amizades dos personagens.',
            ],
            'Percy Jackson e o Ladrão de Raios' => [
                'Atena é uma das figuras que mais gosto de pesquisar. Essa mistura com aventura funciona muito bem!',
                'O humor deixa a leitura muito leve. É uma boa indicação para quem quer começar uma série.',
            ],
        ];
        $photoBooks = ['1984', 'O Hobbit', 'Harry Potter e a Pedra Filosofal', 'Duna', 'Percy Jackson e o Ladrão de Raios'];

        $books = Book::whereIn('title', array_keys($publications))->get()->keyBy('title');
        $missing = array_diff(array_keys($publications), $books->keys()->all());
        if ($missing) {
            throw new \RuntimeException('Cadastre os livros antes de adicionar os posts: '.implode(', ', $missing));
        }

        $stats = DB::transaction(function () use ($publications, $books, $commentsByBook, $photoBooks) {
            // Use only demonstration accounts, never attribute sample posts to real readers.
            $readers = User::where('is_admin', false)->where(function ($query) {
                foreach (['example.com', 'example.org', 'example.net'] as $domain) {
                    $query->orWhere('email', 'like', '%@'.$domain);
                }
            })->orderBy('id')->limit(5)->get();

            for ($index = 0; $readers->count() < 5; $index++) {
                $readers->push(User::firstOrCreate(['email' => 'reader'.$index.'@lumi.example'], [
                    'name' => 'Leitor Lumi '.($index + 1),
                    'nickname' => 'leitor_lumi_demo_'.$index,
                    'description' => 'Perfil de demonstração do clube de leitura.',
                    'password' => Hash::make(Str::random(64)),
                    'is_admin' => false,
                ]));
            }

            $stats = ['posts' => 0, 'likes' => 0, 'comments' => 0, 'photos' => 0];
            foreach ($publications as $title => $content) {
                $index = array_search($title, array_keys($publications), true);
                $post = Post::firstOrCreate([
                    'fk_book_id' => $books[$title]->id,
                    'content' => $content,
                ], [
                    'fk_user_id' => $readers[$index % $readers->count()]->id,
                    'created_at' => now()->subHours(count($publications) - $index),
                    'updated_at' => now()->subHours(count($publications) - $index),
                ]);
                $stats['posts'] += (int) $post->wasRecentlyCreated;

                // Enrich only posts authored by the demonstration readers.
                if (! $readers->contains('id', $post->fk_user_id)) {
                    continue;
                }

                $cover = $books[$title]->cover_url;
                if (in_array((string) $title, $photoBooks, true) && ! $post->media_url && $cover && Storage::disk('public')->exists($cover)) {
                    $post->update(['media_url' => $cover]);
                    $stats['photos']++;
                }

                $participants = $readers->where('id', '!=', $post->fk_user_id)->values();
                foreach ($participants->take(2 + $index % 3) as $offset => $reader) {
                    $stats['likes'] += DB::table('post_likes')->insertOrIgnore([
                        'post_id' => $post->id,
                        'user_id' => $reader->id,
                        'created_at' => $post->created_at->copy()->addMinutes(5 + $offset * 3),
                        'updated_at' => $post->created_at->copy()->addMinutes(5 + $offset * 3),
                    ]);
                }

                foreach ($commentsByBook[$title] as $offset => $content) {
                    if ($participants->isEmpty()) {
                        break;
                    }
                    $reader = $participants[($index + $offset) % $participants->count()];
                    $comment = $post->comments()->firstOrCreate([
                        'user_id' => $reader->id,
                        'content' => $content,
                    ], [
                        'created_at' => $post->created_at->copy()->addMinutes(15 + $offset * 12),
                        'updated_at' => $post->created_at->copy()->addMinutes(15 + $offset * 12),
                    ]);
                    $stats['comments'] += (int) $comment->wasRecentlyCreated;
                }
            }

            return $stats;
        });

        $this->command?->info("Adicionados: {$stats['posts']} posts, {$stats['likes']} curtidas, {$stats['comments']} comentários e {$stats['photos']} imagens.");
    }
}
