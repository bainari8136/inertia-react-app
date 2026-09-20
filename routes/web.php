<?php

use App\Http\Controllers\AcademicController;
use App\Http\Controllers\AcademicResultController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClearanceController;
use App\Http\Controllers\CourseAllocationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExamMarkController;
use App\Http\Controllers\FeeStructureController;
use App\Http\Controllers\FinanceReportController;
use App\Http\Controllers\GraduationCohortController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RegistrationApprovalController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
     return redirect()->route('login.form');

    //echo "Welcome to University ERP";
    
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login.form');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::get('/forgot-password', [AuthController::class, 'forgotPasswordForm'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'resetPasswordForm'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/applicants', [ApplicantController::class, 'index'])->name('applicants.index');
    Route::get('/applicants/create', [ApplicantController::class, 'create'])->name('applicants.create');
    Route::post('/applicants', [ApplicantController::class, 'store'])->name('applicants.store');
    Route::get('/applicants/{applicant}', [ApplicantController::class, 'show'])->name('applicants.show');
    Route::get('/applicants/{applicant}/edit', [ApplicantController::class, 'edit'])->name('applicants.edit');
    Route::put('/applicants/{applicant}', [ApplicantController::class, 'update'])->name('applicants.update');
    Route::post('/applicants/{applicant}/approve', [ApplicantController::class, 'approve'])->name('applicants.approve');
    Route::post('/applicants/{applicant}/reject', [ApplicantController::class, 'reject'])->name('applicants.reject');

    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::patch('/students/{student}/status', [StudentController::class, 'updateStatus'])->name('students.update-status');

    Route::get('/academic/semesters', [AcademicController::class, 'semesters'])->name('academic.semesters');
    Route::post('/academic/years', [AcademicController::class, 'storeAcademicYear'])->name('academic.years.store');
    Route::post('/academic/semesters', [AcademicController::class, 'storeSemester'])->name('academic.semesters.store');
    Route::get('/academic/courses', [AcademicController::class, 'courses'])->name('academic.courses');
    Route::post('/academic/courses', [AcademicController::class, 'storeCourse'])->name('academic.courses.store');

    Route::get('/academic/allocations', [CourseAllocationController::class, 'index'])->name('academic.allocations.index');
    Route::post('/academic/allocations', [CourseAllocationController::class, 'store'])->name('academic.allocations.store');
    Route::delete('/academic/allocations/{allocation}', [CourseAllocationController::class, 'destroy'])->name('academic.allocations.destroy');

    Route::get('/academic/marks', [ExamMarkController::class, 'index'])->name('academic.marks.index');
    Route::get('/academic/marks/{allocation}', [ExamMarkController::class, 'show'])->name('academic.marks.show');
    Route::post('/academic/marks/{allocation}', [ExamMarkController::class, 'store'])->name('academic.marks.store');
    Route::post('/academic/marks/{allocation}/submit', [ExamMarkController::class, 'submit'])->name('academic.marks.submit');

    Route::get('/academic/results', [AcademicResultController::class, 'index'])->name('academic.results.index');
    Route::post('/academic/results/{allocation}/publish', [AcademicResultController::class, 'publish'])->name('academic.results.publish');
    Route::get('/academic/my-results', [AcademicResultController::class, 'myResults'])->name('academic.results.my-results');
    Route::get('/students/{student}/transcript', [AcademicResultController::class, 'transcript'])->name('students.transcript');

    Route::get('/clearance', [ClearanceController::class, 'index'])->name('clearance.index');
    Route::get('/clearance/my-clearance', [ClearanceController::class, 'myClearance'])->name('clearance.my-clearance');
    Route::post('/clearance', [ClearanceController::class, 'store'])->name('clearance.store');
    Route::get('/clearance/{clearance}', [ClearanceController::class, 'show'])->name('clearance.show');
    Route::post('/clearance/stages/{stage}/approve', [ClearanceController::class, 'approveStage'])->name('clearance.stages.approve');
    Route::post('/clearance/stages/{stage}/reject', [ClearanceController::class, 'rejectStage'])->name('clearance.stages.reject');
    Route::get('/clearance/{clearance}/certificate', [ClearanceController::class, 'certificate'])->name('clearance.certificate');

    Route::get('/graduation', [GraduationCohortController::class, 'index'])->name('graduation.index');
    Route::post('/graduation', [GraduationCohortController::class, 'store'])->name('graduation.store');
    Route::get('/graduation/{cohort}', [GraduationCohortController::class, 'show'])->name('graduation.show');

    Route::get('/registration', [RegistrationController::class, 'index'])->name('registration.index');
    Route::post('/registration/start', [RegistrationController::class, 'start'])->name('registration.start');
    Route::get('/registration/{registration}', [RegistrationController::class, 'show'])->name('registration.show');
    Route::post('/registration/{registration}/courses', [RegistrationController::class, 'addCourse'])->name('registration.courses.add');
    Route::delete('/registration/{registration}/courses/{courseRegistration}', [RegistrationController::class, 'dropCourse'])->name('registration.courses.drop');
    Route::post('/registration/{registration}/submit', [RegistrationController::class, 'submit'])->name('registration.submit');

    Route::get('/registration-approvals', [RegistrationApprovalController::class, 'index'])->name('registration-approvals.index');
    Route::get('/registration-approvals/{registration}', [RegistrationApprovalController::class, 'show'])->name('registration-approvals.show');
    Route::post('/registration-approvals/{registration}/approve', [RegistrationApprovalController::class, 'approve'])->name('registration-approvals.approve');
    Route::post('/registration-approvals/{registration}/reject', [RegistrationApprovalController::class, 'reject'])->name('registration-approvals.reject');

    Route::get('/finance/fee-structures', [FeeStructureController::class, 'index'])->name('finance.fee-structures.index');
    Route::post('/finance/fee-structures', [FeeStructureController::class, 'store'])->name('finance.fee-structures.store');
    Route::put('/finance/fee-structures/{feeStructure}', [FeeStructureController::class, 'update'])->name('finance.fee-structures.update');
    Route::post('/finance/fee-structures/{feeStructure}/bulk-invoice', [FeeStructureController::class, 'bulkInvoice'])->name('finance.fee-structures.bulk-invoice');

    Route::get('/finance/invoices', [InvoiceController::class, 'index'])->name('finance.invoices.index');
    Route::get('/finance/invoices/create', [InvoiceController::class, 'create'])->name('finance.invoices.create');
    Route::post('/finance/invoices', [InvoiceController::class, 'store'])->name('finance.invoices.store');
    Route::get('/finance/invoices/{invoice}', [InvoiceController::class, 'show'])->name('finance.invoices.show');
    Route::post('/finance/invoices/{invoice}/cancel', [InvoiceController::class, 'cancel'])->name('finance.invoices.cancel');
    Route::post('/finance/invoices/{invoice}/payments', [PaymentController::class, 'store'])->name('finance.payments.store');

    Route::get('/finance/reports', [FinanceReportController::class, 'index'])->name('finance.reports');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');

    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');

    Route::get('/change-password', [AuthController::class, 'changePasswordForm'])->name('password.change');
    Route::put('/change-password', [AuthController::class, 'changePassword'])->name('password.change.update');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
