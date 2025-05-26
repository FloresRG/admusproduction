<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use App\Http\Controllers\CompanyCategoryController;
use App\Http\Controllers\DatoInfluencersController;
use App\Http\Controllers\InfluencerAvailabilityController;
use App\Http\Controllers\PasanteController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\TipoController;
use App\Http\Controllers\WeekController;

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


    // —– Rutas para Weeks —–
    Route::prefix('weeks')->group(function () {
        // Listar semanas
        Route::get('/', [WeekController::class, 'index'])->name('weeks.index');
        Route::post('/', [WeekController::class, 'store'])->name('weeks.store');
        Route::put('{week}', [WeekController::class, 'update'])->name('weeks.update');
        Route::delete('{week}', [WeekController::class, 'destroy'])->name('weeks.destroy');

        // Listar bookings DE UNA semana concreta
        // Nota el parametro se llama {week} para que exista coherencia de Binding
        Route::get('{week}/bookings', [WeekController::class, 'bookingsByWeek'])
            ->name('weeks.bookings.index');
    });
    // —– Rutas para Booking (UPDATE) —–
    // ¡Esto SALE fuera del prefix('weeks')!
    Route::patch('bookings/{booking}', [BookingController::class, 'update'])
        ->name('bookings.update');

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
    Route::get('/bookings', [BookingController::class, 'bookingsThisWeekForAuthenticatedUser']);



    Route::post('tipos', [TipoController::class, 'store']); // Crear un nuevo tipo
    Route::get('tipos', [TipoController::class, 'index']); // Mostrar todos los usuarios y tipos usando Inertia
    Route::get('tipos/{userId}/tipos', [TipoController::class, 'getTiposByUserId']); // Obtener tipos de un usuario
    Route::put('tipos/{userId}/tipos', [TipoController::class, 'updateTiposByUserId']); // Actualizar tipos de un usuario

    Route::put('tipos/{tipoId}', [TipoController::class, 'editTipo']); // Editar un tipo
    Route::delete('tipos/{tipoId}', [TipoController::class, 'destroyTipo']); // Eliminar un tipo
    Route::get('/pasante', [PasanteController::class, 'index'])->name('pasante.index');
    Route::get('/pasante/historial', [PasanteController::class, 'historial'])->name('pasante.historial');
    Route::put('/pasante/actualizar/{tareaId}', [PasanteController::class, 'actualizarEstado'])->name('pasante.actualizar');
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

Route::get('/influencers', function () {
    return Inertia::render('influencers/index');
});


Route::get('/api/influencer-availability', [InfluencerAvailabilityController::class, 'index']);
Route::post('/api/influencer-availability', [InfluencerAvailabilityController::class, 'store']);
Route::put('/api/influencer-availability/{id}', [InfluencerAvailabilityController::class, 'update']);
Route::delete('/api/influencer-availability/{id}', [InfluencerAvailabilityController::class, 'destroy']);
Route::post('/api/asignar-empresa', [InfluencerAvailabilityController::class, 'asignarEmpresa']);
Route::get('/api/reporte-empresas-asignadas', [InfluencerAvailabilityController::class, 'generarPdfEmpresasAsignadas']);





require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
Route::get('/infuencersdatos', function () {
    return Inertia::render('influencers/infuencersdatos');
});

Route::get('/api/infuencersdatos', [DatoInfluencersController::class, 'index']);
Route::post('/infuencersdatos', [DatoInfluencersController::class, 'store']);
Route::put('/infuencersdatos/{id}', [DatoInfluencersController::class, 'update']);
Route::delete('/infuencersdatos/{user}', [DatoInfluencersController::class, 'destroy']);
Route::post('/api/datos', [DatoInfluencersController::class, 'storedato']);
Route::get('/api/roles', fn() => response()->json(Role::all()));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/tareas', [TareaController::class, 'index'])->name('tareas.index');
    Route::get('/tareas/create', [TareaController::class, 'create'])->name('tareas.create');
    Route::post('/tareas', [TareaController::class, 'store'])->name('tareas.store');
    Route::get('/tareas/{id}/edit', [TareaController::class, 'edit'])->name('tareas.edit');
    Route::put('/tareas/{id}', [TareaController::class, 'update'])->name('tareas.update');
    Route::delete('/tareas/{id}', [TareaController::class, 'destroy'])->name('tareas.destroy');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
