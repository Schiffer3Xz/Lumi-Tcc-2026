<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->string('moderation_status', 20)->default('unavailable');
            $table->uuid('moderation_token')->nullable();
            $table->string('moderation_model')->nullable();
            $table->json('moderation_result')->nullable();
            $table->timestamp('moderated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['moderation_status', 'moderation_token', 'moderation_model', 'moderation_result', 'moderated_at']);
        });
    }
};
