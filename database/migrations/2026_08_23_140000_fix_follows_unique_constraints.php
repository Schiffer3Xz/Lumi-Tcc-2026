<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('follows', function (Blueprint $table) {
            $table->dropUnique('follows_fk_follower_id_unique');
            $table->dropUnique('follows_fk_followed_id_unique');
            $table->unique(['fk_follower_id', 'fk_followed_id']);
        });
    }

    public function down(): void
    {
        Schema::table('follows', function (Blueprint $table) {
            $table->dropUnique('follows_fk_follower_id_fk_followed_id_unique');
            $table->unique('fk_follower_id');
            $table->unique('fk_followed_id');
        });
    }
};