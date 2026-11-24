<?php

namespace App\Http\Controllers;

use App\Exceptions\GeminiUnavailable;
use App\Services\GeminiAI;
use Gemini\Exceptions\ErrorException as GeminiError;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class ReadingAssistantController extends Controller
{
    public function chat(Request $request, GeminiAI $gemini): JsonResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'reset' => ['sometimes', 'boolean'],
        ]);

        try {
            $response = $gemini->chat($request);

            return response()->json(['response' => $response]);
        } catch (Throwable $exception) {
            $providerStatus = match (true) {
                $exception instanceof GeminiUnavailable => $exception->providerStatus,
                $exception instanceof GeminiError => $exception->getErrorCode(),
                default => null,
            };
            Log::warning('Reading assistant request failed.', [
                'model' => config('services.gemini.model'),
                'exception_type' => $exception::class,
                'provider_status' => $providerStatus,
                'failure_type' => $exception instanceof GeminiUnavailable ? $exception->failureType : null,
                'location' => basename($exception->getFile()).':'.$exception->getLine(),
            ]);

            return match (true) {
                $exception instanceof GeminiUnavailable => response()->json([
                    'message' => 'Estou recebendo muitas solicitações neste momento. Que tal tentar novamente daqui a pouquinho? 💜',
                ], 503),
                $providerStatus === 429 => response()->json([
                    'message' => 'A Lumi atingiu o limite de solicitações. Tente novamente mais tarde.',
                    'code' => 'provider_rate_limit',
                ], 429),
                default => response()->json(
                    ['message' => 'Não consegui responder agora. Tente novamente!'],
                    $exception instanceof GeminiError ? 502 : 500,
                ),
            };
        }
    }
}
