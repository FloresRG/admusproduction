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
        Schema::create('estrategias_utilizadas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporte_venta_id')->constrained('reportes_ventas')->onDelete('cascade');
            $table->text('metodo_estrategia');
            $table->text('herramientas_usadas');
            $table->text('resultado_esperado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estrategia_utilizadas');
    }
};
