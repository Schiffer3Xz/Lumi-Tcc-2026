<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {

            $table->id();
            $table->string('title', 150);
            $table->integer('page_count');
            $table->foreignId('fk_author_id')->constrained('authors');
            $table->foreignId('fk_genre_id')->constrained('genres');
            $table->foreignId('fk_availability_id')->constrained('availabilities');
            $table->text('description')->nullable();
            $table->string('cover_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
