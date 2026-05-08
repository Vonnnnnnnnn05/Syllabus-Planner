<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('full_name')->after('name')->nullable();
            $table->foreignId('department_id')->nullable()->after('full_name')->constrained('departments')->onDelete('set null');
            $table->string('role', 30)->default('Teacher')->after('department_id');
            $table->string('avatar', 10)->nullable()->after('role');
            $table->string('status', 20)->default('Active')->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn(['full_name', 'department_id', 'role', 'avatar', 'status']);
        });
    }
};
