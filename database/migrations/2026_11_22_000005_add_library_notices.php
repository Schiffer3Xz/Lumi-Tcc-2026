<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('is_library_notice')->default(false);
            $table->json('notice_images')->nullable();
            $table->timestamp('notice_removed_at')->nullable();
            $table->index(['is_library_notice', 'notice_removed_at', 'created_at']);
        });
        Schema::create('library_notice_books', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->primary(['post_id', 'book_id']);
        });
        Schema::create('library_notice_reads', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('read_at');
            $table->primary(['post_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('library_notice_reads');
        Schema::dropIfExists('library_notice_books');
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['is_library_notice', 'notice_removed_at', 'created_at']);
            $table->dropColumn(['is_library_notice', 'notice_images', 'notice_removed_at']);
        });
    }
};
