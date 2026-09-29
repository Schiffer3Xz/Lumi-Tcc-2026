<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Keep reports available for review when an account or reported item is deleted.
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['fk_user_id']);
            $table->dropForeign(['fk_post_id']);
            $table->dropForeign(['fk_comment_id']);
        });
        Schema::table('reports', function (Blueprint $table) {
            $table->unsignedBigInteger('fk_user_id')->nullable()->change();
            $table->unsignedBigInteger('fk_post_id')->nullable()->change();
            $table->unsignedBigInteger('fk_comment_id')->nullable()->change();
            $table->foreign('fk_user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('fk_post_id')->references('id')->on('posts')->nullOnDelete();
            $table->foreign('fk_comment_id')->references('id')->on('post_comments')->nullOnDelete();
            $table->string('status', 20)->default('pending')->index();
            $table->text('review_note')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->json('target_snapshot')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropForeign(['fk_user_id']);
            $table->dropForeign(['fk_post_id']);
            $table->dropForeign(['fk_comment_id']);
            $table->dropIndex(['status']);
            $table->dropColumn(['status', 'review_note', 'reviewed_by', 'reviewed_at', 'target_snapshot']);
            $table->foreign('fk_user_id')->references('id')->on('users');
            $table->foreign('fk_post_id')->references('id')->on('posts');
            $table->foreign('fk_comment_id')->references('id')->on('post_comments');
        });
    }
};
