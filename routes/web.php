<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\CompanyCategoryController;


// Ruta para mostrar la lista de empresas
Route::get('/companies', [CompanyController::class, 'index'])->name('companies.index');

// Ruta para crear una nueva empresa (procesada por POST)
Route::post('/companies', [CompanyController::class, 'store'])->name('companies.store');

// Ruta para actualizar los datos de una empresa (procesada por PUT)
Route::put('/companies/{company}', [CompanyController::class, 'update'])->name('companies.update');


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::prefix('categories')->group(function () {
    Route::get('/', [CompanyCategoryController::class, 'index']);
    Route::post('/', [CompanyCategoryController::class, 'store']);
    Route::put('{id}', [CompanyCategoryController::class, 'update']);
    Route::delete('{id}', [CompanyCategoryController::class, 'destroy']);
});

});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
