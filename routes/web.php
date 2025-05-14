<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use App\Http\Controllers\CompanyCategoryController;
use App\Http\Controllers\InfluencerAvailabilityController;


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
    Route::prefix('companies')->group(function () {
        Route::get('/', [CompanyController::class, 'index'])->name('index');
        Route::get('/create', [CompanyController::class, 'create'])->name('create');
        Route::post('/', [CompanyController::class, 'store'])->name('store');
        Route::get('{company}/edit', [CompanyController::class, 'edit'])->name('edit');
        Route::put('{company}', [CompanyController::class, 'update'])->name('update');
        Route::delete('{company}', [CompanyController::class, 'destroy'])->name('destroy');
    });
    Route::get('/users', function () {
        return Inertia::render('user');
    });

    Route::get('/api/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::get('/api/roles', fn() => response()->json(Role::all()));
    Route::get('/roles', function () {
        return Inertia::render('roles');
    });
    Route::get('/api/roles', [RoleController::class, 'index']);
    Route::post('/create/roles', [RoleController::class, 'store']);
    Route::get('/api/permissions', fn() => response()->json(Permission::all()));
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
});

Route::get('/users', function () {
    return Inertia::render('user');
});

Route::get('/api/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);
Route::get('/api/roles', fn () => response()->json(Role::all()));
Route::get('/roles', function () {
    return Inertia::render('roles');
});
Route::get('/api/roles', [RoleController::class, 'index']);
Route::post('/create/roles', [RoleController::class, 'store']);
Route::get('/api/permissions', fn() => response()->json(Permission::all()));
Route::put('/roles/{role}', [RoleController::class, 'update']);
Route::delete('/roles/{role}', [RoleController::class, 'destroy']);

Route::get('/influencers', function () {
    return Inertia::render('influencers/index');
});


Route::get('/api/influencer-availability', [InfluencerAvailabilityController::class, 'index']);
Route::post('/api/influencer-availability', [InfluencerAvailabilityController::class, 'store']);
Route::put('/api/influencer-availability/{id}', [InfluencerAvailabilityController::class, 'update']);
Route::delete('/api/influencer-availability/{id}', [InfluencerAvailabilityController::class, 'destroy']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
