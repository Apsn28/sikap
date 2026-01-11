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
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('case_number')->unique();
            $table->text('description')->nullable();
            $table->string('status')->default('Aktif'); // Aktif, Selesai, Pending, Ditolak
            $table->string('category'); // Korupsi, Narkotika, etc.
            $table->string('progress_status')->default('Baru Masuk'); // Baru Masuk, Verifikasi, etc.
            $table->integer('progress_percentage')->default(0);
            $table->string('responsible_person')->nullable(); // Can be linked to users later
            $table->string('priority')->default('medium'); // low, medium, high
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
