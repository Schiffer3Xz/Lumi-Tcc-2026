<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\GeminiAI;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
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

    public function test_service_failure_returns_friendly_message(): void
    {
        $this->mock(GeminiAI::class)->shouldReceive('chat')->once()
            ->andThrow(new \RuntimeException('Private provider details'));
        $this->actingAs(User::factory()->create())->postJson('/api/gemini', ['message' => 'Oi'])
            ->assertStatus(503)->assertJsonPath('message', 'Não consegui responder agora. Tente novamente!')
            ->assertDontSee('Private provider details');
    }
}
