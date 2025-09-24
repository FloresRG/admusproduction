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
        Schema::create('empresa_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained('tarea_seguimiento')->onDelete('cascade');
            $table->integer('visualizaciones')->default(0);
            $table->integer('me_gusta')->default(0);
            $table->integer('comentarios')->default(0);
            $table->integer('compartidas')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresa_videos');
    }
};
