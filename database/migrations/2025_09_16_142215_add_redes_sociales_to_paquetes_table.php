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
        Schema::table('paquetes', function (Blueprint $table) {
            $table->integer('tiktok_mes')->nullable();
            $table->integer('tiktok_semana')->nullable();
            $table->integer('facebook_mes')->nullable();
            $table->integer('facebook_semana')->nullable();
            $table->integer('instagram_mes')->nullable();
            $table->integer('instagram_semana')->nullable();
            $table->integer('artesfacebook_mes')->nullable();
            $table->integer('artesfacebook_semana')->nullable();
            $table->integer('artesinstagram_mes')->nullable();
            $table->integer('artesinstagram_semana')->nullable();
            $table->text('extras')->nullable();
            $table->integer('total_publicaciones')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('paquetes', function (Blueprint $table) {
            $table->dropColumn([
                'tiktok_mes',
                'tiktok_semana',
                'facebook_mes',
                'facebook_semana',
                'instagram_mes',
                'instagram_semana',
                'artesfacebook_mes',
                'artesfacebook_semana',
                'artesinstagram_mes',
                'artesinstagram_semana',
                'extras',
                'total_publicaciones',
            ]);
        });
    }
};
