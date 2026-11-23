<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_rules', function (Blueprint $table) {
            $table->id();
            $table->text('text');
            $table->timestamps();
        });

        $rules = [
            'Prazo máximo de empréstimo: 7 dias úteis por exemplar.',
            'Máximo de 2 livros emprestados simultaneamente por aluno.',
            'Renovações devem ser solicitadas pelo sistema até o dia do vencimento.',
            'Danos ou extravios resultam em reposição do exemplar pelo responsável.',
            'Respeite o silêncio e o espaço coletivo da sala de leitura.',
            'A devolução fora do prazo implica suspensão do serviço por 7 dias.',
        ];

        foreach ($rules as $text) {
            DB::table('reading_rules')->insert(['text' => $text, 'created_at' => now(), 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_rules');
    }
};
