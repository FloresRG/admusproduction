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
        Schema::create('premios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_premio');
            $table->text('descripcion')->nullable();
            $table->integer('puntos_necesarios')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('premios');
    }
};
