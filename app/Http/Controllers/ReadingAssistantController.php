<?php

namespace App\Http\Controllers;

use App\Services\GeminiAI;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        } catch (Throwable) {
            return response()->json(['message' => 'Não consegui responder agora. Tente novamente!'], 503);
        }
    }
}
