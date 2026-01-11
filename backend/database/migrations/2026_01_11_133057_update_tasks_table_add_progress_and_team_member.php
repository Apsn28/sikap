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
        Schema::table('tasks', function (Blueprint $table) {
            $table->integer('progress')->default(0);
            $table->dropForeign(['assigned_to']);
            $table->dropColumn('assigned_to');
            $table->foreignId('team_member_id')->nullable()->constrained('team_members')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['team_member_id']);
            $table->dropColumn(['progress', 'team_member_id']);
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
        });
    }
};
