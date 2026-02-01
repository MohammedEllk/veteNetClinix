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
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->constrained('animaux')->onDelete('cascade');
            $table->foreignId('veterinaire_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('date_consultation');
            $table->text('motif')->nullable();
            $table->text('diagnostic')->nullable();
            $table->text('traitement')->nullable();
            $table->float('poids')->nullable();
            $table->float('temperature')->nullable();
            $table->text('recommandations')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
