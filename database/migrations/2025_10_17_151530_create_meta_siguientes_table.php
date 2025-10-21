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
        Schema::create('metas_siguientes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporte_venta_id')->constrained('reportes_ventas')->onDelete('cascade');
            $table->text('objetivo');
            $table->text('accion_implementar');
            $table->string('responsable')->nullable();
            $table->date('fecha_cumplimiento')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meta_siguientes');
    }
};
