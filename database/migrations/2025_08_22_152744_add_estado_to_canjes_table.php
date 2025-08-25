<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('canjes', function (Blueprint $table) {
        $table->enum('estado', ['pendiente', 'recogido', 'cancelado'])
              ->default('pendiente')
              ->after('fecha');
        $table->timestamp('fecha_recogido')->nullable()->after('estado');
    });
}

public function down()
{
    Schema::table('canjes', function (Blueprint $table) {
        $table->dropColumn(['estado', 'fecha_recogido']);
    });
}
};
