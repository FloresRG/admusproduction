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
        Schema::create('paquetes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_paquete');
            $table->text('caracteristicas')->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('monto', 10, 2)->nullable(); // decimal con precisión
            $table->integer('puntos')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('paquetes');
    }
};
