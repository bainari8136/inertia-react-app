<?php

namespace Database\Seeders;

use App\Models\FeeStructure;
use App\Models\Programme;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    public function run(): void
    {
        $programme = Programme::where('code', 'BSC-CS')->first();
        $semester = Semester::query()->current()->first();

        if (! $programme) {
            return;
        }

        FeeStructure::firstOrCreate(
            [
                'programme_id' => $programme->id,
                'name' => 'Tuition — Semester 1',
            ],
            [
                'semester_id' => $semester?->id,
                'description' => 'Standard tuition for Semester 1',
                'amount' => 2500.00,
                'is_active' => true,
            ]
        );

        FeeStructure::firstOrCreate(
            [
                'programme_id' => $programme->id,
                'name' => 'Registration fee',
            ],
            [
                'semester_id' => null,
                'description' => 'One-time registration fee',
                'amount' => 150.00,
                'is_active' => true,
            ]
        );
    }
}
