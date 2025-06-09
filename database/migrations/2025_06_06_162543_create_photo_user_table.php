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
        Schema::create('photo_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->nullable();
            $table->foreignId('photo_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'photo_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('photo_user');
    }
};
