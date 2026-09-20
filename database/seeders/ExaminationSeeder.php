<?php

namespace Database\Seeders;

use App\Models\AssessmentType;
use App\Models\GradingScale;
use Illuminate\Database\Seeder;

class ExaminationSeeder extends Seeder
{
    public function run(): void
    {
        $assessments = [
            [
                'name' => 'Test 1',
                'code' => 'T1',
                'category' => AssessmentType::CATEGORY_COURSEWORK,
                'max_score' => 100.00,
                'weight_percentage' => 20.00,
                'is_active' => true,
            ],
            [
                'name' => 'Test 2',
                'code' => 'T2',
                'category' => AssessmentType::CATEGORY_COURSEWORK,
                'max_score' => 100.00,
                'weight_percentage' => 20.00,
                'is_active' => true,
            ],
            [
                'name' => 'Final Examination',
                'code' => 'FE',
                'category' => AssessmentType::CATEGORY_FINAL_EXAM,
                'max_score' => 100.00,
                'weight_percentage' => 60.00,
                'is_active' => true,
            ],
        ];

        foreach ($assessments as $assessment) {
            AssessmentType::firstOrCreate(['code' => $assessment['code']], $assessment);
        }

        $scales = [
            ['grade' => 'A', 'min_score' => 70.00, 'max_score' => 100.00, 'grade_points' => 5.0, 'remark' => 'Pass'],
            ['grade' => 'B+', 'min_score' => 60.00, 'max_score' => 69.99, 'grade_points' => 4.0, 'remark' => 'Pass'],
            ['grade' => 'B', 'min_score' => 50.00, 'max_score' => 59.99, 'grade_points' => 3.0, 'remark' => 'Pass'],
            ['grade' => 'C', 'min_score' => 40.00, 'max_score' => 49.99, 'grade_points' => 2.0, 'remark' => 'Pass'],
            ['grade' => 'D', 'min_score' => 35.00, 'max_score' => 39.99, 'grade_points' => 1.0, 'remark' => 'Supplementary'],
            ['grade' => 'F', 'min_score' => 0.00, 'max_score' => 34.99, 'grade_points' => 0.0, 'remark' => 'Fail'],
        ];

        foreach ($scales as $scale) {
            GradingScale::firstOrCreate(['grade' => $scale['grade']], $scale);
        }
    }
}
