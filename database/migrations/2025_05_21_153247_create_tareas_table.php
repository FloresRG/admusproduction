<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('prioridad'); 
            $table->text('descripcion');
            $table->text('empresa')->nullable();
            $table->date('fecha');
            $table->unsignedBigInteger('tipo_id');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->timestamps();

            // Claves foráneas
            $table->foreign('tipo_id')->references('id')->on('tipos')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tareas');
    }
};
