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
        Schema::create('informes', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('nombre_cliente')->nullable();
            $table->string('nombre_empresa')->nullable();
            $table->string('estado')->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();;
            $table->text('descripcion')->nullable();
            $table->string('tipo')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('informes');
    }
};
