<?php

namespace App\Services\Moderation;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class OpenAiModeration
{

    //Avalia e ve se a key e o serviço estao ok
    public function available(): bool{

        return config('moderation.enabled') === true && filled(config('services.openai.key'));
    }

    public function analyze(string|array $text){

    //Joga um erro se der algum erro com o serviço
        if(! $this->available()){
            throw new ModerationUnavailable('Serviço de moderação indisponível. Confira a configuração da chave da API.');
        }

        //Tenta conexao
        try{
            $response = Http::withToken(config('services.openai.key'))
            ->acceptJson()->asJson()->connectTimeout(3)->timeout(12)
            ->withOptions(['allow_redirects' => false])
            ->post('https://api.openai.com/v1/moderations', [
                'model' => config('services.openai.moderation_model'),
                'input' => $text,
            ]);
        //Esse catch pega problemas durante a execução, pega erros de conexao
        }catch(Throwable){
            Log::warning('Moderation failed. Please try again later');
            throw new ModerationUnavailable('Não foi possivel conectar-se a moderação');
        }

        //Esse if pega erros de status invalidos como api fora de ar
        if(! $response->successful()){
            Log::warning('Moderation API request failed.', [
                'status' => $response->status(),
                'code' => $response->json('error.code'),
            ]);
            throw new ModerationUnavailable('Serviço de moderação indisponível.');
        }

        //Tratando todos os dados da resposta pra nao dar ruim
        $result = $response->json('results.0');
        $model = $response->json('model');

        //Valida todas as respostas
        if (! is_array($result)
            || ! is_bool($result['flagged'] ?? null)
            || ! is_array($result['categories'] ?? null) || empty($result['categories'])
            || ! is_array($result['category_scores'] ?? null)
            || ! is_string($model) || strlen($model) > 255) {
            throw new ModerationUnavailable('Resposta de moderação inválida.');
        }

        $categories = [];
        $scores = [];

        foreach ($result['categories'] as $category => $flag) {
            $score = $result['category_scores'][$category] ?? null;
            if (! is_string($category) || ! preg_match('/^[a-z][a-z\/-]{0,60}$/', $category)
                || ! is_bool($flag) || ! is_numeric($score) || ! is_finite((float) $score) || $score < 0 || $score > 1) {
                throw new ModerationUnavailable('Classificação de moderação inválida.');
            }
            $categories[$category] = $flag;
            $scores[$category] = (float) $score;
        }

        return ['model' => $model, 'result' => ['flagged' => $result['flagged'], 
        'categories' => $categories, 'category_scores' => $scores]];
    }

    public function analyzeExtremistContent(string $imageDataUrl): array
    {
        if (! $this->available()) {
            throw new ModerationUnavailable();
        }

        try {
            $response = Http::withToken(config('services.openai.key'))
                ->acceptJson()
                ->asJson()
                ->connectTimeout(3)
                ->timeout(25)
                ->withOptions(['allow_redirects' => false])
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => config('services.openai.image_analysis_model', 'gpt-4.1-mini'),

                    'response_format' => [
                        'type' => 'json_object',
                    ],

                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Você é um sistema de análise de imagens para moderação de conteúdo. Responda exclusivamente em JSON válido.',
                        ],
                        [
                            'role' => 'user',
                            'content' => [
                                [
                                    'type' => 'text',
                                    'text' => 'Analise esta imagem e identifique a presença de símbolos, propaganda ou conteúdo relacionado ao nazismo.

                                    Diferencie a simples presença de símbolos nazistas de conteúdo que promove, glorifica ou faz apologia ao nazismo.

                                    Imagens históricas, jornalísticas, educativas ou documentais não devem ser classificadas automaticamente como apologia.

                                    Retorne um JSON com:
                                    {
                                        "contains_nazi_symbols": boolean,
                                        "promotes_nazism": boolean,
                                        "confidence": number
                                    }

                                    confidence deve representar sua confiança na classificação de promoção ou apologia ao nazismo, entre 0 e 1.'
                                ],
                                [
                                    'type' => 'image_url',
                                    'image_url' => [
                                        'url' => $imageDataUrl,
                                        'detail' => 'high',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ]);

        } catch (Throwable) {
            Log::warning('Extremist content analysis failed.');

            throw new ModerationUnavailable(
                'Não foi possível analisar a imagem.'
            );
        }

        if (! $response->successful()) {
            Log::warning('Image analysis API request failed.', [
                'status' => $response->status(),
                'code' => $response->json('error.code'),
            ]);

            throw new ModerationUnavailable(
                'Serviço de análise de imagens indisponível.'
            );
        }

        $content = $response->json('choices.0.message.content');

        try {
            $result = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            throw new ModerationUnavailable(
                'Resposta de análise inválida.'
            );
        }

        if (
            ! is_array($result) ||
            ! is_bool($result['contains_nazi_symbols'] ?? null) ||
            ! is_bool($result['promotes_nazism'] ?? null) ||
            ! is_numeric($result['confidence'] ?? null) ||
            ! is_finite((float) $result['confidence']) ||
            $result['confidence'] < 0 ||
            $result['confidence'] > 1
        ) {
            throw new ModerationUnavailable(
                'Classificação de imagem inválida.'
            );
        }

        return [
            'contains_nazi_symbols' => $result['contains_nazi_symbols'],
            'promotes_nazism' => $result['promotes_nazism'],
            'confidence' => (float) $result['confidence'],
        ];
    }
}
