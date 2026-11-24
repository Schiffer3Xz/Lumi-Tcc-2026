<?php

namespace Tests\Feature;

use App\Exceptions\GeminiUnavailable;
use App\Models\User;
use App\Services\GeminiAI;
use Gemini\Exceptions\ErrorException as GeminiError;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\Psr7\Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class ReadingAssistantTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_use_chat(): void
    {
        $this->mock(GeminiAI::class)->shouldNotReceive('chat');
        $this->postJson('/api/gemini', ['message' => 'Oi'])->assertUnauthorized();
    }

    public function test_chat_returns_service_response(): void
    {
        $this->mock(GeminiAI::class)->shouldReceive('chat')->once()
            ->withArgs(fn (Request $request) => $request->input('message') === 'Quero fantasia')
            ->andReturn('Que tipo de fantasia você gosta?');
        $this->actingAs(User::factory()->create())->postJson('/api/gemini', ['message' => 'Quero fantasia'])
            ->assertOk()->assertJsonPath('response', 'Que tipo de fantasia você gosta?');
    }

    public function test_invalid_message_does_not_call_gemini(): void
    {
        $this->mock(GeminiAI::class)->shouldNotReceive('chat');
        $this->actingAs(User::factory()->create());
        foreach (['', str_repeat('a', 2001)] as $message) {
            $this->postJson('/api/gemini', ['message' => $message])
                ->assertUnprocessable()->assertJsonValidationErrors('message');
        }
    }

    public function test_provider_unavailability_returns_friendly_message(): void
    {
        $this->mock(GeminiAI::class)->shouldReceive('chat')->once()
            ->andThrow(new GeminiUnavailable(503));
        $this->actingAs(User::factory()->create())->postJson('/api/gemini', ['message' => 'Oi'])
            ->assertServiceUnavailable()->assertExactJson([
                'message' => 'Estou recebendo muitas solicitações neste momento. Que tal tentar novamente daqui a pouquinho? 💜',
            ]);
    }

    public function test_gateway_errors_are_retried_without_duplicating_chat_history(): void
    {
        $handler = new MockHandler([
            new Response(503, [], 'Overloaded'),
            new Response(502, [], 'Bad gateway'),
            new Response(200, ['Content-Type' => 'application/json'], json_encode([
                'usageMetadata' => ['promptTokenCount' => 10, 'totalTokenCount' => 14],
                'candidates' => [['content' => ['role' => 'model', 'parts' => [
                    ['text' => 'Thought', 'thought' => true],
                    ['text' => 'Olá, '],
                    ['text' => 'leitora!'],
                ]]]],
            ], JSON_THROW_ON_ERROR)),
        ]);
        config(['services.gemini.key' => 'test-key', 'cache.stores.file' => ['driver' => 'array']]);
        $this->instance(GeminiAI::class, new GeminiAI($handler(...)));
        $user = User::factory()->create();
        $cache = Cache::store('file');
        $key = 'lumi_chat_'.$user->id;

        $this->actingAs($user)->postJson('/api/gemini', ['message' => 'Oi', 'reset' => true])
            ->assertOk()->assertJsonPath('response', 'Olá, leitora!');
        $this->assertCount(0, $handler);
        $this->assertSame([
            ['role' => 'user', 'text' => 'Oi'],
            ['role' => 'assistant', 'text' => 'Olá, leitora!'],
        ], $cache->get($key));
    }

    public function test_provider_rate_limit_returns_429_without_provider_details(): void
    {
        $this->mock(GeminiAI::class)->shouldReceive('chat')->once()
            ->andThrow(new GeminiError(['code' => 429, 'message' => 'Private quota details', 'status' => 'RESOURCE_EXHAUSTED']));
        $this->actingAs(User::factory()->create())->postJson('/api/gemini', ['message' => 'Oi'])
            ->assertTooManyRequests()->assertJsonPath('code', 'provider_rate_limit')
            ->assertDontSee('Private quota details');
    }

    public function test_provider_authentication_error_does_not_look_like_user_authentication_error(): void
    {
        $this->mock(GeminiAI::class)->shouldReceive('chat')->once()
            ->andThrow(new GeminiError(['code' => 403, 'message' => 'Private key details', 'status' => 'PERMISSION_DENIED']));
        $this->actingAs(User::factory()->create())->postJson('/api/gemini', ['message' => 'Oi'])
            ->assertStatus(502)->assertDontSee('Private key details');
    }

    public function test_unexpected_failure_returns_generic_message(): void
    {
        $this->mock(GeminiAI::class)->shouldReceive('chat')->once()
            ->andThrow(new \RuntimeException('Private provider details'));
        $this->actingAs(User::factory()->create())->postJson('/api/gemini', ['message' => 'Oi'])
            ->assertInternalServerError()->assertJsonPath('message', 'Não consegui responder agora. Tente novamente!')
            ->assertDontSee('Private provider details');
    }
}
