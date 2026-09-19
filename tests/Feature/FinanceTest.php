<?php

namespace Tests\Feature;

use App\Models\FeeStructure;
use App\Models\Invoice;
use App\Models\Programme;
use App\Models\Student;
use App\Models\User;
use App\Services\FinanceService;
use Database\Seeders\AcademicSeeder;
use Database\Seeders\FinanceSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RegistrationCalendarSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            AcademicSeeder::class,
            RegistrationCalendarSeeder::class,
            FinanceSeeder::class,
        ]);
    }

    public function test_finance_officer_can_create_invoice_and_record_payment(): void
    {
        $programme = Programme::where('code', 'BSC-CS')->first();
        $student = Student::create([
            'programme_id' => $programme->id,
            'registration_number' => 'BSC-CS/2026/0200',
            'status' => Student::STATUS_ACTIVE,
            'first_name' => 'Fee',
            'last_name' => 'Payer',
            'email' => 'payer@university.test',
            'admitted_at' => now(),
        ]);

        $fee = FeeStructure::where('programme_id', $programme->id)->first();
        $officer = User::factory()->create();
        $officer->assignRole('Finance Officer');

        $this->actingAs($officer)
            ->post(route('finance.invoices.store'), [
                'student_id' => $student->id,
                'fee_structure_id' => $fee->id,
            ])
            ->assertRedirect();

        $invoice = Invoice::where('student_id', $student->id)->first();
        $this->assertNotNull($invoice);
        $this->assertEquals(2500.00, (float) $invoice->amount);

        $this->actingAs($officer)
            ->post(route('finance.payments.store', $invoice), [
                'amount' => 1000,
                'payment_method' => 'bank_transfer',
                'reference' => 'TXN-001',
            ])
            ->assertRedirect(route('finance.invoices.show', $invoice));

        $invoice->refresh();
        $this->assertEquals(Invoice::STATUS_PARTIAL, $invoice->status);
        $this->assertEquals(1000.00, (float) $invoice->amount_paid);
    }

    public function test_student_outstanding_balance_is_calculated(): void
    {
        $programme = Programme::where('code', 'BSC-CS')->first();
        $student = Student::create([
            'programme_id' => $programme->id,
            'registration_number' => 'BSC-CS/2026/0201',
            'status' => Student::STATUS_ACTIVE,
            'first_name' => 'Balance',
            'last_name' => 'Test',
            'email' => 'balance@university.test',
            'admitted_at' => now(),
        ]);

        $officer = User::factory()->create();
        $officer->assignRole('Finance Officer');

        $service = app(FinanceService::class);
        $invoice = $service->createInvoice($student, 'Test fee', 500.00, $officer);
        $service->recordPayment($invoice, 200.00, 'cash', $officer);

        $this->assertEquals(300.00, $service->studentOutstandingBalance($student));
    }

    public function test_student_can_view_own_invoices(): void
    {
        $programme = Programme::where('code', 'BSC-CS')->first();
        $user = User::factory()->create();
        $user->assignRole('Student');

        $student = Student::create([
            'user_id' => $user->id,
            'programme_id' => $programme->id,
            'registration_number' => 'BSC-CS/2026/0202',
            'status' => Student::STATUS_ACTIVE,
            'first_name' => 'Student',
            'last_name' => 'View',
            'email' => 'studentview@university.test',
            'admitted_at' => now(),
        ]);

        $officer = User::factory()->create();
        $officer->assignRole('Finance Officer');
        app(FinanceService::class)->createInvoice($student, 'Tuition', 100.00, $officer);

        $this->actingAs($user)
            ->get(route('finance.invoices.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Finance/Invoices/Index')
                ->has('invoices.data', 1)
            );
    }
}
