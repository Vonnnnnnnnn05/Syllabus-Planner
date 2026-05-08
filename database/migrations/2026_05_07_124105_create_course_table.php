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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('course_code', 20);
            $table->string('course_title');
            $table->text('course_description')->nullable();
            $table->string('prerequisite', 100)->nullable();
            $table->tinyInteger('credit_units')->default(3);
            $table->string('semester', 50);
            $table->string('academic_year', 20);
            $table->tinyInteger('total_hours')->default(54);
            $table->tinyInteger('lecture_hours')->default(36);
            $table->tinyInteger('lab_hours')->default(18);
            $table->string('status', 20)->default('Draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
