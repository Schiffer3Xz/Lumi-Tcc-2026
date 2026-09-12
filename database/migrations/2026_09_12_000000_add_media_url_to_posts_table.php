<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('posts', 'media_url')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->string('media_url')->nullable()->after('content');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('posts', 'media_url')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->dropColumn('media_url');
            });
        }
    }
};