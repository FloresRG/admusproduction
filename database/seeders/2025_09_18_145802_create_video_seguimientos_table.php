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
        Schema::create('videos_seguimiento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('companies')->onDelete('cascade');
            $table->integer('year');
            $table->string('mes');
            $table->string('semana');
            $table->string('nombre');
            $table->date('fecha_produccion')->nullable();
            $table->string('estado_produccion')->nullable();
            $table->date('fecha_edicion')->nullable();
            $table->string('estado_edicion')->nullable();
            $table->date('fecha_entrega')->nullable();
            $table->string('estado_entrega')->nullable();
            $table->text('estrategia')->nullable();
            $table->text('retroalimentacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos_seguimiento');
    }
};
