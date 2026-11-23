<?php

namespace App\Services\Moderation;

use Illuminate\Support\Str;

class ContentPolicy
{
    public function violation($text){
        $text = strtolower($text);
        $normalied = preg_replace('/[^\p{L}\p{N}]/u', '', $text);

        $badWords = [
            // Os seus originais
            "puto",
            "porra",
            "caralho",

            // Variações diretas e pesadas
            "puta",
            "putaria",
            "filho da puta",
            "filha da puta",
            "fdp",
            "pqp",
            "puta que pariu",
            "caralhos",
            "krl",
            "kct",
            "cacete",
            "cacetada",

            // Órgãos genitais / Sexual (calão pesado)
            "buceta",
            "boceta",
            "bct",
            "xoxota",
            "xereca",
            "pau no cu",
            "vai tomar no cu",
            "tomar no cu",
            "vtnc",
            "vsf",
            "vai se foder",
            "foder",
            "foda",
            "foda-se",
            "fodase",
            "fodido",
            "fudido",
            "arrombado",
            "arrombada",
            "cuzão",
            "cuzao",
            "cu",
            "rola",
            "piroca",
            "pica",
            "pinto",
            "siririca",
            "punheta",
            "punheteiro",
            "boquete",
            "corno",
            "corna",
            "vagabundo",
            "vagabunda",
            "piranha",
            "vadia",
            "rapariga",
            "prostituta",
            "escrotos",
            "escroto",
            "escrota",
            "broxa",

            // Ofensas de cunho preconceituoso / ódio (pesadas para moderação)
            "viado",
            "veado",
            "bicha",
            "sapatão",
            "sapatao",
            "traveco",
            "retardado",
            "retardada",
            "mongoloide",
            "macaco",
            "crioulo",
            "nigga",
            "nigger",

            // Frases de exaltação ao nazismo, sem espaços ou pontuação
            "heilhitler",
            "siegheil",
            "vivahitler",
            "vivaonazismo",
            "euapoioonazismo",
            "nazismosempre",
            "eusounazista",
            "nazismoemuitolegal"
        ];

        foreach($badWords as $word){

            if(str_contains($normalied, $word)){

                return "Mensagem bloqueada por conteúdo imprórpio";
            }
        }

        return null;
    }
}