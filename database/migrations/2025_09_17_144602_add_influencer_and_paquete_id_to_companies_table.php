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
        Schema::table('companies', function (Blueprint $table) {
            $table->string('influencer')->nullable();
            $table->foreignId('paquete_id')->nullable()->constrained('paquetes')->onDelete('set null');
            $table->string('nombre_cliente')->nullable();
            $table->text('especificaciones')->nullable();
            $table->integer('seguidores_inicio')->nullable();
            $table->integer('seguidores_fin')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
   public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // Eliminar los nuevos campos
            $table->dropColumn('nombre_cliente');
            $table->dropColumn('especificaciones');
            $table->dropColumn('seguidores_inicio');
            $table->dropColumn('seguidores_fin');

            // Eliminar campos previos
            $table->dropColumn('influencer');
            $table->dropForeign(['paquete_id']);
            $table->dropColumn('paquete_id');
        });
    }
};
