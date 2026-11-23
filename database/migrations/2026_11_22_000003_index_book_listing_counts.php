<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('book_ratings', fn (Blueprint $table) => $table->index(['book_id', 'rating']));
        Schema::table('reading_progresses', fn (Blueprint $table) => $table->index(['book_id', 'user_id']));
    }

    public function down(): void
    {
        Schema::table('reading_progresses', fn (Blueprint $table) => $table->dropIndex(['book_id', 'user_id']));
        Schema::table('book_ratings', fn (Blueprint $table) => $table->dropIndex(['book_id', 'rating']));
    }
};
