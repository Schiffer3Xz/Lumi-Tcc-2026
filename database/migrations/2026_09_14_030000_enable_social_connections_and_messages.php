<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['follows_fk_follower_id_unique', 'follows_fk_followed_id_unique'] as $index) {
            if (Schema::hasIndex('follows', $index)) {
                Schema::table('follows', fn (Blueprint $table) => $table->dropUnique($index));
            }
        }
        Schema::table('follows', function (Blueprint $table) {
            $table->unique(['fk_follower_id', 'fk_followed_id']);
            $table->index('fk_followed_id');
        });
        Schema::create('direct_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('recipient_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['recipient_id', 'read_at']);
            $table->index(['sender_id', 'recipient_id', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('direct_messages');
        Schema::table('follows', function (Blueprint $table) {
            $table->dropUnique(['fk_follower_id', 'fk_followed_id']);
            $table->dropIndex(['fk_followed_id']);
        });
    }
};
