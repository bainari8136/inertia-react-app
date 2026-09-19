<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Course;
use App\Models\Programme;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class RegistrationCalendarSeeder extends Seeder
{
    public function run(): void
    {
        $year = AcademicYear::firstOrCreate(
            ['name' => '2025/2026'],
            [
                'starts_on' => '2025-09-01',
                'ends_on' => '2026-08-31',
                'is_current' => true,
            ]
        );

        AcademicYear::query()->where('id', '!=', $year->id)->update(['is_current' => false]);

        $semester = Semester::firstOrCreate(
            [
                'academic_year_id' => $year->id,
                'name' => 'Semester 1',
            ],
            [
                'starts_on' => '2025-09-01',
                'ends_on' => '2026-01-31',
                'registration_opens_at' => now()->subDays(7),
                'registration_closes_at' => now()->addDays(60),
                'is_current' => true,
            ]
        );

        Semester::query()->where('id', '!=', $semester->id)->update(['is_current' => false]);

        $programme = Programme::where('code', 'BSC-CS')->first();

        if ($programme) {
            $courses = [
                ['code' => 'CS101', 'name' => 'Introduction to Programming', 'credit_hours' => 3],
                ['code' => 'CS102', 'name' => 'Discrete Mathematics', 'credit_hours' => 3],
                ['code' => 'CS201', 'name' => 'Data Structures', 'credit_hours' => 4],
                ['code' => 'CS202', 'name' => 'Database Systems', 'credit_hours' => 4],
                ['code' => 'CS203', 'name' => 'Computer Networks', 'credit_hours' => 3],
            ];

            foreach ($courses as $course) {
                Course::firstOrCreate(
                    ['programme_id' => $programme->id, 'code' => $course['code']],
                    ['name' => $course['name'], 'credit_hours' => $course['credit_hours']]
                );
            }
        }
    }
}
