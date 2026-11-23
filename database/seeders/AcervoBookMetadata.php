<?php

namespace Database\Seeders;

use Illuminate\Support\Str;

class AcervoBookMetadata
{
    public static function estimate(string $title, string $cdd): array
    {
        $title = Str::lower(Str::ascii($title));
        $code = preg_match('/^\s*(\d{3})(?:\.(\d+))?/', $cdd, $matches) ? (int) $matches[1] : null;
        $decimal = $matches[2] ?? '';

        $genre = match (true) {
            self::has($title, 'quadrinhos|manga|graphic novel|tirinhas|mafalda|turma da monica') || ($code === 741 && str_starts_with($decimal, '5')) => 'Quadrinhos',
            self::has($title, 'dicionario|enciclopedia|almanaque|atlas') => 'Referência',
            self::has($title, 'poesia|poesias|poema|poemas|soneto|sonetos|haicai') => 'Poesia',
            self::has($title, 'biografia|autobiografia|memorias de') || $code === 920 => 'Biografia',
            self::has($title, 'terror|horror|lovecraft|dracula') => 'Terror',
            self::has($title, 'harry potter|senhor dos aneis|percy jackson|o hobbit|cronicas de narnia') => 'Fantasia',
            self::has($title, 'dom casmurro|o cortico|vidas secas|quincas borba|romance') => 'Romance',
            self::has($title, 'contos|cronicas|fabulas') => 'Contos e crônicas',
            self::has($title, 'teatro|dramaturgia') => 'Teatro',
            $code === 28 && str_starts_with($decimal, '5') => 'Infantojuvenil',
            in_array($code, [4, 5, 6], true) => 'Informática',
            $code !== null && $code < 100 => 'Referência',
            $code !== null && $code < 200 => 'Filosofia e psicologia',
            $code !== null && $code < 300 => 'Religião',
            $code !== null && $code >= 370 && $code < 380 => 'Educação',
            $code !== null && $code < 400 => 'Ciências sociais',
            $code !== null && $code < 500 => 'Línguas',
            $code !== null && $code < 600 => 'Ciências e matemática',
            $code !== null && $code < 620 => 'Saúde',
            $code === 641 => 'Gastronomia',
            $code !== null && $code >= 650 && $code < 660 => 'Administração e negócios',
            $code !== null && $code < 700 => 'Tecnologia',
            $code !== null && $code < 800 => 'Artes e esportes',
            $code === 869 && preg_match('/^(?:9)?1/', $decimal) === 1 => 'Poesia',
            $code === 869 && preg_match('/^(?:9)?2/', $decimal) === 1 => 'Teatro',
            $code === 869 && preg_match('/^(?:9)?3/', $decimal) === 1 => 'Romance',
            in_array($code, [811, 821, 831, 841, 851, 861], true) => 'Poesia',
            in_array($code, [812, 822, 832, 842, 852, 862], true) => 'Teatro',
            in_array($code, [813, 823, 833, 843, 853, 863], true) => 'Ficção',
            $code !== null && $code < 900 => 'Literatura',
            $code !== null && $code < 920 => 'História e geografia',
            $code !== null && $code < 1000 => 'História',
            self::has($title, 'enfermagem|medicina|anatomia|saude|farmacologia|doenca') => 'Saúde',
            self::has($title, 'contabilidade|administracao|marketing|gestao empresarial') => 'Administração e negócios',
            self::has($title, 'culinaria|gastronomia|receitas|vinho|confeitaria') => 'Gastronomia',
            self::has($title, 'informatica|programacao|software|banco de dados|windows') => 'Informática',
            self::has($title, 'historia|revolucao|guerra mundial|republica|imperio') => 'História',
            self::has($title, 'educacao|pedagogia|escola|ensino') => 'Educação',
            self::has($title, 'fisica|quimica|biologia|matematica|astronomia|geometria') => 'Ciências e matemática',
            self::has($title, 'engenharia|eletrica|eletronic[ao]|mecanica|automacao|soldagem') => 'Tecnologia',
            self::has($title, 'ingles|espanhol|gramatica|linguistica|vocabulario') => 'Línguas',
            default => 'Interesse geral',
        };

        $pages = match ($genre) {
            'Infantojuvenil' => 96,
            'Quadrinhos', 'Poesia', 'Teatro' => 112,
            'Contos e crônicas', 'Interesse geral' => 160,
            'Gastronomia', 'Artes e esportes' => 192,
            'História', 'História e geografia', 'Romance', 'Biografia' => 240,
            'Tecnologia', 'Informática', 'Ciências e matemática' => 288,
            'Fantasia', 'Saúde' => 320,
            'Referência' => 384,
            default => 208,
        };

        if (self::has($title, 'cartilha|folheto')) {
            $pages = 48;
        } elseif (self::has($title, 'guia rapido|livro de bolso')) {
            $pages = min($pages, 128);
        } elseif (self::has($title, 'tratado|manual completo|obras completas')) {
            $pages = max($pages, 384);
        }

        return [$genre, $pages];
    }

    private static function has(string $title, string $terms): bool
    {
        return preg_match('/\b(?:'.$terms.')\b/', $title) === 1;
    }
}
