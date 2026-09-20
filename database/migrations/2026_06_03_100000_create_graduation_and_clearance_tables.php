<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('graduation_cohorts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->date('ceremony_date');
            $table->string('status')->default('open_for_clearance'); // upcoming, open_for_clearance, concluded
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('clearance_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('graduation_cohort_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type')->default('graduation'); // graduation, departure, transfer
            $table->string('status')->default('in_progress'); // in_progress, approved, rejected
            $table->decimal('overall_cgpa', 4, 2)->nullable();
            $table->string('degree_classification')->nullable();
            $table->string('certificate_number')->nullable()->unique();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->text('final_remarks')->nullable();
            $table->timestamps();
        });

        Schema::create('clearance_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clearance_request_id')->constrained()->cascadeOnDelete();
            $table->string('department'); // academic, library, hostel, finance, dean_of_students, registrar
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('remarks')->nullable();
            $table->foreignId('cleared_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('cleared_at')->nullable();
            $table->timestamps();

            $table->unique(['clearance_request_id', 'department']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clearance_stages');
        Schema::dropIfExists('clearance_requests');
        Schema::dropIfExists('graduation_cohorts');
    }
};
