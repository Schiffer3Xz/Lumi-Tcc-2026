<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
        });

        // The group creation flow inserts the creator before the selected participants.
        DB::table('conversations')->where('is_group', true)->orderBy('id')->each(function ($group) {
            $creator = DB::table('conversation_users')->where('fk_conversation_id', $group->id)
                ->orderBy('id')->value('fk_user_id');
            DB::table('conversations')->where('id', $group->id)->update(['created_by' => $creator]);
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
        });
    }
};
