<?php

namespace App\Services;

use App\Models\ClearanceRequest;
use App\Models\ClearanceStage;
use App\Models\GraduationCohort;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ClearanceService
{
    public function __construct(
        private GradingService $gradingService,
        private FinanceService $financeService,
    ) {}

    public function initiateClearance(
        Student $student,
        ?GraduationCohort $cohort = null,
        string $type = ClearanceRequest::TYPE_GRADUATION
    ): ClearanceRequest {
        $existing = ClearanceRequest::query()
            ->where('student_id', $student->id)
            ->whereIn('status', [ClearanceRequest::STATUS_IN_PROGRESS, ClearanceRequest::STATUS_APPROVED])
            ->latest()
            ->first();

        if ($existing) {
            if ($existing->status === ClearanceRequest::STATUS_APPROVED) {
                throw ValidationException::withMessages([
                    'clearance' => 'You have already completed the clearance process and your certificate is issued.',
                ]);
            }

            return $existing->load(['stages.clearedBy', 'graduationCohort', 'student.programme']);
        }

        $cgpa = $this->gradingService->calculateCumulativeGpa($student);
        $classification = $this->determineDegreeClassification($cgpa);

        return DB::transaction(function () use ($student, $cohort, $type, $cgpa, $classification) {
            $request = ClearanceRequest::create([
                'student_id' => $student->id,
                'graduation_cohort_id' => $cohort?->id,
                'type' => $type,
                'status' => ClearanceRequest::STATUS_IN_PROGRESS,
                'overall_cgpa' => $cgpa > 0 ? $cgpa : null,
                'degree_classification' => $classification,
                'submitted_at' => now(),
            ]);

            $outstandingBalance = $this->financeService->studentOutstandingBalance($student);
            $financeRemark = $outstandingBalance > 0
                ? 'Outstanding balance: TZS ' . number_format($outstandingBalance, 2)
                : 'No outstanding institutional dues recorded.';

            $departments = [
                ClearanceStage::DEPT_ACADEMIC => null,
                ClearanceStage::DEPT_LIBRARY => null,
                ClearanceStage::DEPT_HOSTEL => null,
                ClearanceStage::DEPT_FINANCE => $financeRemark,
                ClearanceStage::DEPT_WELFARE => null,
                ClearanceStage::DEPT_REGISTRAR => null,
            ];

            foreach ($departments as $dept => $defaultRemark) {
                ClearanceStage::create([
                    'clearance_request_id' => $request->id,
                    'department' => $dept,
                    'status' => ClearanceStage::STATUS_PENDING,
                    'remarks' => $defaultRemark,
                ]);
            }

            return $request->load(['stages.clearedBy', 'graduationCohort', 'student.programme']);
        });
    }

    public function updateStage(
        ClearanceStage $stage,
        string $status,
        ?string $remarks,
        User $clearedBy
    ): ClearanceStage {
        $clearanceRequest = $stage->clearanceRequest;

        if ($stage->department === ClearanceStage::DEPT_REGISTRAR && $status === ClearanceStage::STATUS_APPROVED) {
            $unapproved = ClearanceStage::query()
                ->where('clearance_request_id', $clearanceRequest->id)
                ->where('department', '!=', ClearanceStage::DEPT_REGISTRAR)
                ->where('status', '!=', ClearanceStage::STATUS_APPROVED)
                ->pluck('department')
                ->all();

            if (! empty($unapproved)) {
                $labels = array_map(fn ($d) => ucfirst(str_replace('_', ' ', $d)), $unapproved);
                throw ValidationException::withMessages([
                    'stage' => 'Cannot grant final Registrar approval. The following departments are not yet approved: ' . implode(', ', $labels),
                ]);
            }
        }

        DB::transaction(function () use ($stage, $clearanceRequest, $status, $remarks, $clearedBy) {
            $stage->update([
                'status' => $status,
                'remarks' => $remarks ?? $stage->remarks,
                'cleared_by' => $clearedBy->id,
                'cleared_at' => now(),
            ]);

            if ($status === ClearanceStage::STATUS_REJECTED) {
                $clearanceRequest->update([
                    'status' => ClearanceRequest::STATUS_REJECTED,
                    'final_remarks' => "Held by {$stage->departmentLabel()}: {$remarks}",
                ]);
            } elseif ($stage->department === ClearanceStage::DEPT_REGISTRAR && $status === ClearanceStage::STATUS_APPROVED) {
                $certNumber = 'CLR-' . date('Y') . '-' . str_pad((string) $clearanceRequest->id, 5, '0', STR_PAD_LEFT);

                $clearanceRequest->update([
                    'status' => ClearanceRequest::STATUS_APPROVED,
                    'certificate_number' => $certNumber,
                    'completed_at' => now(),
                    'final_remarks' => 'All departmental clearances fully approved by Academic Registrar.',
                ]);

                if ($clearanceRequest->type === ClearanceRequest::TYPE_GRADUATION) {
                    $clearanceRequest->student->update([
                        'status' => Student::STATUS_GRADUATED,
                    ]);
                }
            } else {
                if ($clearanceRequest->status === ClearanceRequest::STATUS_REJECTED) {
                    $hasOtherRejection = ClearanceStage::query()
                        ->where('clearance_request_id', $clearanceRequest->id)
                        ->where('status', ClearanceStage::STATUS_REJECTED)
                        ->exists();

                    if (! $hasOtherRejection) {
                        $clearanceRequest->update([
                            'status' => ClearanceRequest::STATUS_IN_PROGRESS,
                            'final_remarks' => null,
                        ]);
                    }
                }
            }
        });

        return $stage->fresh(['clearedBy', 'clearanceRequest.student']);
    }

    public function determineDegreeClassification(float $cgpa): string
    {
        if ($cgpa >= 4.40) {
            return 'First Class';
        }
        if ($cgpa >= 3.50) {
            return 'Upper Second Class';
        }
        if ($cgpa >= 2.70) {
            return 'Lower Second Class';
        }
        if ($cgpa >= 2.00) {
            return 'Pass';
        }

        return 'Fail / Ineligible';
    }

    public function getGraduationList(GraduationCohort $cohort): array
    {
        $cohort->loadMissing('academicYear');

        $requests = ClearanceRequest::query()
            ->where('graduation_cohort_id', $cohort->id)
            ->where('type', ClearanceRequest::TYPE_GRADUATION)
            ->where('status', ClearanceRequest::STATUS_APPROVED)
            ->with(['student.programme.department.faculty'])
            ->orderBy('degree_classification')
            ->get();

        $grouped = [];

        foreach ($requests as $req) {
            $student = $req->student;
            $programme = $student?->programme;
            $progName = $programme?->name ?? 'General Programme';

            if (! isset($grouped[$progName])) {
                $grouped[$progName] = [
                    'programme_name' => $progName,
                    'programme_code' => $programme?->code,
                    'faculty' => $programme?->department?->faculty?->name,
                    'graduands' => [],
                ];
            }

            $grouped[$progName]['graduands'][] = [
                'id' => $req->id,
                'student_id' => $student?->id,
                'registration_number' => $student?->registration_number,
                'name' => $student?->fullName(),
                'gender' => $student?->gender,
                'cgpa' => (float) $req->overall_cgpa,
                'classification' => $req->degree_classification,
                'certificate_number' => $req->certificate_number,
                'cleared_at' => $req->completed_at?->toDateString(),
            ];
        }

        return [
            'cohort' => [
                'id' => $cohort->id,
                'name' => $cohort->name,
                'ceremony_date' => $cohort->ceremony_date?->toDateString(),
                'academic_year' => $cohort->academicYear?->name,
                'status' => $cohort->status,
                'total_graduands' => $requests->count(),
            ],
            'programmes' => array_values($grouped),
        ];
    }
}
