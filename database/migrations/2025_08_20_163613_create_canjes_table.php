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
        Schema::create('canjes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_premio');
            $table->date('fecha');
            $table->timestamps();

            // Relaciones (si existen las tablas users y premios)
            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_premio')->references('id')->on('premios')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('canjes');
    }
};
