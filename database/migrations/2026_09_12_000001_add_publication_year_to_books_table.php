<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('books', 'publication_year')) {
            Schema::table('books', function (Blueprint $table) {
                $table->unsignedSmallInteger('publication_year')->nullable()->after('page_count');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('books', 'publication_year')) {
            Schema::table('books', function (Blueprint $table) {
                $table->dropColumn('publication_year');
            });
        }
    }
};