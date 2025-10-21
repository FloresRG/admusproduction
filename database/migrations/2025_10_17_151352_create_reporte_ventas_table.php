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
        Schema::create('reportes_ventas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_reporte')->nullable();
            $table->foreignId('jefe_ventas_id')->constrained('users')->onDelete('cascade');
            $table->string('tipo_periodo')->nullable();
            $table->date('fecha_reporte');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->text('observaciones')->nullable();
            $table->text('recomendaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporte_ventas');
    }
};
