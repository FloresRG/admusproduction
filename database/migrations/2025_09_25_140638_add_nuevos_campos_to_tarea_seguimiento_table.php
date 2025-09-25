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
        Schema::table('tarea_seguimiento', function (Blueprint $table) {
            $table->date('fecha_nueva_produccion')->nullable()->after('fecha_produccion');
            $table->text('razon_produccion')->nullable()->after('fecha_nueva_produccion');

            $table->date('fecha_nueva_edicion')->nullable()->after('fecha_edicion');
            $table->text('razon_edicion')->nullable()->after('fecha_nueva_edicion');

            $table->date('fecha_nueva_entrega')->nullable()->after('fecha_entrega');
            $table->text('razon_entrega')->nullable()->after('fecha_nueva_entrega');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tarea_seguimiento', function (Blueprint $table) {
            $table->dropColumn([
                'fecha_nueva_produccion',
                'razon_produccion',
                'fecha_nueva_edicion',
                'razon_edicion',
                'fecha_nueva_entrega',
                'razon_entrega'
            ]);
        });
    }
};
