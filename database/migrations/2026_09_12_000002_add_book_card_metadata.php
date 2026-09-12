<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            if (! Schema::hasColumn('books', 'publisher')) {
                $table->string('publisher')->nullable()->after('publication_year');
            }

            if (! Schema::hasColumn('books', 'rating')) {
                $table->decimal('rating', 2, 1)->default(0)->after('publisher');
            }

            if (! Schema::hasColumn('books', 'readers_count')) {
                $table->unsignedInteger('readers_count')->default(0)->after('rating');
            }
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $columns = collect(['publisher', 'rating', 'readers_count'])
                ->filter(fn ($column) => Schema::hasColumn('books', $column))
                ->values()
                ->all();

            if ($columns) {
                $table->dropColumn($columns);
            }
        });
    }
};