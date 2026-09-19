<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Faculty;
use App\Models\Programme;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        $science = Faculty::firstOrCreate(
            ['code' => 'SCI'],
            ['name' => 'Faculty of Science']
        );

        $cs = Department::firstOrCreate(
            ['code' => 'CS'],
            ['faculty_id' => $science->id, 'name' => 'Computer Science']
        );

        Programme::firstOrCreate(
            ['code' => 'BSC-CS'],
            [
                'department_id' => $cs->id,
                'name' => 'BSc Computer Science',
                'duration_years' => 4,
            ]
        );

        $business = Faculty::firstOrCreate(
            ['code' => 'BUS'],
            ['name' => 'Faculty of Business']
        );

        $acct = Department::firstOrCreate(
            ['code' => 'ACC'],
            ['faculty_id' => $business->id, 'name' => 'Accounting']
        );

        Programme::firstOrCreate(
            ['code' => 'BBA-ACC'],
            [
                'department_id' => $acct->id,
                'name' => 'BBA Accounting',
                'duration_years' => 4,
            ]
        );
    }
}
