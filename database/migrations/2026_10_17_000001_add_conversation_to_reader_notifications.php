<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reader_notifications', function (Blueprint $table) {
            $table->foreignId('conversation_id')->nullable()->constrained('conversations')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('reader_notifications', fn (Blueprint $table) => $table->dropConstrainedForeignId('conversation_id'));
    }
};
