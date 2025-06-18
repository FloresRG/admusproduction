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
        Schema::table('companies', function (Blueprint $table) {
            $table->string('contrato')->nullable()->after('contract_duration');
            $table->decimal('monto_mensual', 10, 2)->nullable()->after('contrato');
            $table->string('celular')->nullable()->after('monto_mensual');
            $table->string('logo')->nullable()->after('celular');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['contrato', 'monto_mensual']);
        });
    }
};
