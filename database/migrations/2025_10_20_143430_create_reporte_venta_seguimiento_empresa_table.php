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
        // database/migrations/xxxx_xx_xx_create_reporte_venta_seguimiento_empresa_table.php

        Schema::create('reporte_venta_seguimiento_empresa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporte_venta_id')->constrained('reportes_ventas')->onDelete('cascade');
            $table->foreignId('seguimiento_empresa_id')->constrained('seguimiento_empresa')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporte_venta_seguimiento_empresa');
    }
};
