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
        Schema::create('dificultades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporte_venta_id')->constrained('reportes_ventas')->onDelete('cascade');
            $table->string('tipo');
            $table->text('descripcion');
            $table->text('impacto');
            $table->text('accion_tomada')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dificultads');
    }
};
