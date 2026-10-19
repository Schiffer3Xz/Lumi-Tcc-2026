<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\Moderation\ContentPolicy;
use App\Services\Moderation\PublicationModeration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ContentPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_coco_and_lixoso_are_allowed_without_hiding_other_words(): void
    {
        $policy = app(ContentPolicy::class);
        foreach (['coco', 'cocô', 'COCÔ', 'lixoso', 'lixosa'] as $word) {
            $this->assertNull($policy->violation($word, 'book_comment'));
            $this->assertSame('ruim', $policy->analysisText($word));
            $this->assertSame('ruim ameaça', $policy->analysisText($word.' ameaça'));
            $this->assertNotNull($policy->violation($word.' porra', 'book_comment'));
        }
        $this->assertSame('cocômetro', $policy->analysisText('cocômetro'));
    }

    public function test_book_comments_are_checked_before_rating_or_comment_changes_are_saved(): void
    {
        $book = \App\Models\Book::create([
            'title' => 'Discussão histórica', 'page_count' => 100,
            'fk_author_id' => \App\Models\Author::create(['name' => 'Autor'])->id,
            'fk_genre_id' => \App\Models\Genre::create(['name' => 'História'])->id,
            'fk_availability_id' => \App\Models\Availability::create(['availability' => 'Disponível'])->id,
        ]);
        $user = User::factory()->create();
        $this->actingAs($user)->post(route('book.rating', $book->id), [
            'rating' => 4, 'comment' => 'O livro critica o nazismo e o fascismo.',
        ])->assertSessionHasNoErrors();
        $this->post(route('book.rating', $book->id), ['rating' => 1, 'comment' => 'p0rra'])
            ->assertSessionHasErrors('comment');
        $this->assertDatabaseHas('book_ratings', [
            'book_id' => $book->id, 'user_id' => $user->id, 'rating' => 4,
            'comment' => 'O livro critica o nazismo e o fascismo.',
        ]);
    }

    public function test_registration_cannot_save_an_offensive_name(): void
    {
        $this->post(route('register'), [
            'name' => 'RoludoGames', 'email' => 'reader@example.test',
            'password' => 'Password123!', 'password_confirmation' => 'Password123!',
        ])->assertSessionHasErrors('name');
        $this->assertDatabaseMissing('users', ['email' => 'reader@example.test']);
    }

    public function test_local_rules_detect_disguises_and_embedded_names_without_external_calls(): void
    {
        $policy = app(ContentPolicy::class);
        foreach (['cu', 'buceta', 'caralho', 'pinto', 'porra', 'puta', 'p0rra', 'p.o.r.r.a', 'p o r r a', 'pooorra', "po\u{200B}rra", 'RoludoGAmes', 'nazistaGames', 'fascista123', 'porragames', 'PintoGames', 'PutaGames'] as $text) {
            $this->assertNotNull($policy->violation($text, 'nickname'), $text);
        }
        foreach (['cultura', 'computador', 'disputa', 'reputação', 'Paulo', 'pintura', 'controlar', 'merda', 'bosta', 'lixo', 'Eu pinto uma parede'] as $text) {
            $this->assertNull($policy->violation($text, 'post'), $text);
        }
        $this->assertNull($policy->violation('João Pinto', 'name'));
        $this->assertNotNull($policy->violation('PintoGames', 'name'));
        $this->assertNotNull($policy->violation('O personagem é nazista', 'post'));
        $this->assertNull($policy->violation('O livro critica o regime nazista e fascista.', 'book_comment'));
        $this->assertNotNull($policy->violation('porra', 'book_comment'));
    }

    public function test_profile_refusal_preserves_all_database_fields(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->patch(route('profile.update'), [
            'name' => $user->name, 'email' => $user->email,
            'nickname' => 'nazistaGames', 'description' => 'Nova descrição',
        ])->assertSessionHasErrors('nickname');
        $this->assertNotSame('nazistaGames', $user->fresh()->nickname);
        $this->assertNotSame('Nova descrição', $user->fresh()->description);
    }

    public function test_each_public_profile_field_is_moderated(): void
    {
        foreach (['name', 'nickname', 'description'] as $field) {
            try {
                app(PublicationModeration::class)->validateProfile([$field => 'caralho']);
                $this->fail('Expected a refusal for '.$field);
            } catch (ValidationException $error) {
                $this->assertArrayHasKey($field, $error->errors());
            }
        }
    }

    public function test_book_discussion_still_rejects_hate_flagged_by_provider(): void
    {
        config(['services.openai.key' => 'test-key', 'services.openai.moderation_enabled' => true]);
        Http::fake(['api.openai.com/*' => Http::response([
            'model' => 'omni-moderation-latest', 'results' => [[
                'flagged' => true, 'categories' => ['hate' => true], 'category_scores' => ['hate' => 0.99],
            ]],
        ])]);
        $this->expectException(ValidationException::class);
        app(PublicationModeration::class)->validate('Texto nazista discriminatório', 'comment', 'book_comment');
    }

    public function test_mild_words_do_not_hide_surrounding_content_from_provider(): void
    {
        config(['services.openai.key' => 'test-key', 'services.openai.moderation_enabled' => true]);
        Http::fake(['api.openai.com/*' => Http::response([
            'model' => 'omni-moderation-latest', 'results' => [[
                'flagged' => false, 'categories' => ['hate' => false], 'category_scores' => ['hate' => 0.01],
            ]],
        ])]);
        app(PublicationModeration::class)->validate('Esse livro é uma bosta, que lixo e merda.');
        Http::assertSent(fn ($request) => $request['input'] === 'Esse livro é uma ruim, que ruim e ruim.');
    }
}
