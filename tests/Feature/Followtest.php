<?php

use App\Models\User;

test('Irá verificar se o usuario está seguindo corretamente e se o registro funciona', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();

    $this->actingAs($user);
    $this->post("people/{$target->id}/follow");

    $this->assertDatabaseHas('follows',[
        'fk_follower_id' => $user->id,
        'fk_followed_id' => $target->id,

    ]);
});
