<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('syllabi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('status', 30)->default('Draft');
            $table->integer('version')->default(1);
            $table->timestamp('submitted_at')->nullable();
            $table->string('reviewed_by', 100)->nullable();
            $table->string('approved_by', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('syllabi');
    }
};
