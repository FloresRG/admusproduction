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
        Schema::create('tarea_seguimiento', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->unsignedBigInteger('empresa_id')->nullable();
            $table->integer('anio');
            $table->string('mes');
            $table->string('semana');
            $table->date('fecha_produccion')->nullable();
            $table->string('estado_produccion')->nullable();
            $table->unsignedBigInteger('user_produccion_id')->nullable();
            $table->date('fecha_edicion')->nullable();
            $table->string('estado_edicion')->nullable();
            $table->unsignedBigInteger('user_edicion_id')->nullable();
            $table->date('fecha_entrega')->nullable();
            $table->string('estado_entrega')->nullable();
            $table->string('estrategia')->nullable();
            $table->text('comentario')->nullable();
            $table->text('guion')->nullable();
            $table->timestamps();

            // Claves foráneas (si existen las tablas relacionadas)
            $table->foreign('empresa_id')->references('id')->on('companies');
            $table->foreign('user_produccion_id')->references('id')->on('users');
            $table->foreign('user_edicion_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarea_seguimiento');
    }
};
