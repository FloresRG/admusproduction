<?php

use App\Http\Controllers\AsignacionTareaController;
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
use App\Models\Tarea;

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
        // 1. Mostrar la vista de bookings para una semana
    Route::get('{week}/bookings', [WeekController::class, 'bookingsByWeek'])
         ->name('weeks.bookings.index');

    // 2. Crear (añadir) un booking en esa semana
    Route::post('{week}/bookings', [BookingController::class, 'store'])
         ->name('weeks.bookings.store');

    // 3. Eliminar un booking de esa semana
    Route::delete('{week}/bookings/{booking}', [BookingController::class, 'destroy'])
         ->name('weeks.bookings.destroy');
    });
    // —– Rutas para Booking (UPDATE) —–
    // ¡Esto SALE fuera del prefix('weeks')!
    Route::patch('bookings/{booking}', [BookingController::class, 'update'])
        ->name('weeks.bookings.update');

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


Route::get('/vertareas', function () {
    return Inertia::render('tareas/vertareas');
});
Route::get('/tareas', function () {
    return Inertia::render('tareas/index');
});
Route::get('/api/vertareas', [TareaController::class, 'vertareas']);
Route::get('/api/tareas', [TareaController::class, 'index']);
Route::get('/api/tareas-por-fecha', [TareaController::class, 'tareasPorFecha']);


Route::post('/create/tareas', [TareaController::class, 'store']);
Route::put('/tareas/{tarea}', [TareaController::class, 'update']);
Route::delete('/tareas/{tarea}', [TareaController::class, 'destroy']);
Route::get('/api/tipos', function () {
    return \App\Models\Tipo::select('id', 'nombre_tipo as nombre')->get();
});
Route::get('/api/companies', function () {
    return \App\Models\Company::select('id', 'name as nombre')->get();
});
Route::post('/asignar-tareas', [TareaController::class, 'asignarTareas']);


Route::get('/infuencersdatos', function () {
    return Inertia::render('influencers/infuencersdatos');
});

Route::get('/api/infuencersdatos', [DatoInfluencersController::class, 'index']);
Route::post('/infuencersdatos', [DatoInfluencersController::class, 'store']);
Route::put('/infuencersdatos/{id}', [DatoInfluencersController::class, 'update']);
Route::delete('/infuencersdatos/{user}', [DatoInfluencersController::class, 'destroy']);
Route::post('/api/datos', [DatoInfluencersController::class, 'storedato']);
Route::get('/api/roles', fn() => response()->json(Role::all()));





require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
