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
        Schema::create('asignacion_pasantes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('company_id');
            $table->string('turno'); // mañana, tarde, noche
            $table->date('fecha');
            $table->unsignedBigInteger('week_id');
            $table->string('dia'); // monday, tuesday, etc.
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('week_id')->references('id')->on('weeks')->onDelete('cascade');

            // Evitar duplicados
            $table->unique(['user_id', 'company_id', 'turno', 'fecha']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('asignacion_pasantes');
    }
};
