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
        Schema::create('actividades_realizadas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporte_venta_id')->constrained('reportes_ventas')->onDelete('cascade');
            $table->string('tipo_actividad');
            $table->text('descripcion');
            $table->date('fecha_actividad');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actividad_realizadas');
    }
};
