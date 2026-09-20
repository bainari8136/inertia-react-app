<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lecturer_id')->constrained('users')->cascadeOnDelete();
            $table->string('class_group')->default('Main');
            $table->timestamps();

            $table->unique(['course_id', 'semester_id', 'lecturer_id', 'class_group'], 'course_sem_lect_group_unique');
        });

        Schema::create('assessment_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->unique();
            $table->string('category')->default('coursework'); // coursework, final_exam, supplementary
            $table->decimal('max_score', 5, 2)->default(100.00);
            $table->decimal('weight_percentage', 5, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('grading_scales', function (Blueprint $table) {
            $table->id();
            $table->string('grade', 4);
            $table->decimal('min_score', 5, 2);
            $table->decimal('max_score', 5, 2);
            $table->decimal('grade_points', 4, 2);
            $table->string('remark');
            $table->timestamps();
        });

        Schema::create('course_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_registration_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('course_allocation_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('coursework_score', 5, 2)->nullable();
            $table->decimal('exam_score', 5, 2)->nullable();
            $table->decimal('total_score', 5, 2)->nullable();
            $table->string('grade', 4)->nullable();
            $table->decimal('grade_points', 4, 2)->nullable();
            $table->string('remark')->nullable();
            $table->string('status')->default('draft'); // draft, submitted, published
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('exam_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_result_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assessment_type_id')->constrained()->cascadeOnDelete();
            $table->decimal('score', 5, 2);
            $table->foreignId('entered_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['course_result_id', 'assessment_type_id']);
        });

        Schema::create('student_semester_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('total_credit_hours')->default(0);
            $table->decimal('total_grade_points', 8, 2)->default(0);
            $table->decimal('gpa', 4, 2)->default(0);
            $table->decimal('cgpa', 4, 2)->nullable();
            $table->string('academic_standing')->default('Pending');
            $table->string('status')->default('draft'); // draft, published
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'semester_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_semester_results');
        Schema::dropIfExists('exam_marks');
        Schema::dropIfExists('course_results');
        Schema::dropIfExists('grading_scales');
        Schema::dropIfExists('assessment_types');
        Schema::dropIfExists('course_allocations');
    }
};
