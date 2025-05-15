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
        Schema::create('datos', function (Blueprint $table) {
            $table->id();  // Campo id, autoincremental por defecto
            $table->integer('cantidad');  // Campo cantidad de tipo entero
            $table->unsignedBigInteger('id_user');  // Campo id_user, tipo unsignedBigInteger para referencia
            $table->timestamps();  // Campos de fecha de creación y actualización
            
            // Agregar la restricción de clave foránea (referencia a la tabla users)
            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('datos');
    }
};
