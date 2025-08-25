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
        Schema::create('seguimiento_empresa', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_empresa');
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_paquete');
            $table->string('estado');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->text('descripcion')->nullable();
            $table->string('celular')->nullable();
            $table->timestamps();

            // Relaciones (si existen las tablas users y paquetes)
            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_paquete')->references('id')->on('paquetes')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('seguimiento_empresa');
    }
};
