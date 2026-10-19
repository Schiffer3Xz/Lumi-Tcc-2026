<?php

namespace App\Services\Moderation;

use Illuminate\Support\Str;

class ContentPolicy
{
    public function violation(string $text, string $context): ?string
    {
        $surname = $context === 'name' && preg_match('/^[\p{L}]+(?:\s+[\p{L}]+)+$/u', $text)
            && ! preg_match('/games?|gamer|oficial/i', $text);
        if (! in_array($context, ['name', 'nickname'], true)) {
            $text = preg_replace('/\b(eu\s+pinto|pinto\s+(?:um|uma|o|a)\s+(?:quadro|parede|tela))\b/iu', 'pintura', $text);
        }
        // Split CamelCase before folding accents and removing invisible characters.
        $text = preg_replace('/(?<=[\p{Ll}\d])(?=\p{Lu})/u', ' ', $text);
        $text = mb_strtolower(Str::ascii(preg_replace('/\p{Cf}/u', '', $text)));
        $text = strtr($text, ['0' => 'o', '1' => 'i', '3' => 'e', '4' => 'a', '5' => 's', '7' => 't', '@' => 'a', '$' => 's']);
        $text = preg_replace_callback('/[a-z]+/', function ($match) use ($surname) {
            $word = $match[0];
            if (in_array($word, config('content_moderation.innocent_words'), true)
                || ($surname && $word === 'pinto')) {
                return '|';
            }
            return $word;
        }, $text);

        $terms = config('content_moderation.profanity');
        if ($context !== 'book_comment') {
            $terms = array_merge($terms, config('content_moderation.restricted'));
        }

        foreach ($terms as $term) {
            $letters = str_split($term);
            $pattern = implode('[\W_]*', array_map(fn ($letter) => preg_quote($letter, '~').'+', $letters));
            // Short/ambiguous words require boundaries; names also support gamer suffixes.
            $embedded = strlen($term) >= 4 && ! in_array($term, ['puta', 'puto', 'pinto', 'rola'], true);
            $suffix = in_array($context, ['name', 'nickname'], true) ? '(?:games?|gamer|oficial|ofc|\d+)?' : '';
            $gamerName = in_array($context, ['name', 'nickname'], true)
                && preg_match('~'.$pattern.'(?:games?|gamer|oficial|ofc)(?![a-z])~u', $text);
            if ($gamerName || preg_match('~'.($embedded ? '' : '(?<![a-z])').$pattern.$suffix.($embedded ? '' : '(?![a-z])').'~u', $text)) {
                return in_array($term, config('content_moderation.restricted'), true)
                    ? 'Termos ligados a nazismo ou fascismo são permitidos somente em comentários de livros, em contexto de discussão. Edite este campo.'
                    : 'Este campo contém um palavrão não permitido, inclusive se escrito com símbolos ou números. Remova a expressão e tente novamente.';
            }
        }

        return null;
    }

    public function analysisText(string $text): string
    {
        // These words alone must not cause a refusal. Keep the surrounding context
        // so threats, targeted harassment and discrimination still reach the model.
        return preg_replace('/(?<![\p{L}\p{N}_])(?:'.implode('|', array_map(fn ($word) => preg_quote($word, '/'), config('content_moderation.allowed_mild'))).')(?![\p{L}\p{N}_])/iu', 'ruim', $text);
    }
}
