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
use App\Http\Controllers\CompanyLinkComprobanteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DatoInfluencersController;
use App\Http\Controllers\InfluencerAvailabilityController;
use App\Http\Controllers\InfluencerController;
use App\Http\Controllers\InfluencerDatosController;
use App\Http\Controllers\PagosController;
use App\Http\Controllers\PasanteController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\SemanaController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\TipoController;
use App\Http\Controllers\WeekController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/fotografias', fn() => Inertia::render('fotografias/fotografia'))
    ->name('fotografias');

Route::get('/servicios/produccion-audiovisual', fn() => Inertia::render('servicios/produccion-audiovisual'))
    ->name('servicios.produccion-audiovisual');

// ——— Rutas públicas para React/Inertia ———

Route::get('/consultorias', fn() => Inertia::render('paginas/Consultorias'))
    ->name('consultorias');

Route::get('/eventos-digitales', fn() => Inertia::render('paginas/EventosDigitales'))
    ->name('eventos.digitales');







Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('dashboard');
    Route::prefix('categories')->group(function () {
        Route::get('/', [CompanyCategoryController::class, 'index']);
        Route::post('/', [CompanyCategoryController::class, 'store']);
        Route::put('{id}', [CompanyCategoryController::class, 'update']);
        Route::delete('{id}', [CompanyCategoryController::class, 'destroy']);
    });
    Route::prefix('companies')->group(function () {
        Route::get('/', [CompanyController::class, 'index'])->name('companies.index');
        Route::get('/create', [CompanyController::class, 'create'])->name('create');
        Route::post('/', [CompanyController::class, 'store'])->name('store');
        Route::get('{id}/edit', [CompanyController::class, 'edit'])->name('companies.edit');
        Route::put('{id}', [CompanyController::class, 'update'])->name('companies.update');
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
    Route::put('/pasante/actualizar/{id}', [PasanteController::class, 'actualizarEstado'])->name('pasante.actualizar');

    // Listado global de asignaciones
    Route::get('/asignaciones', [AsignacionTareaController::class, 'index'])
        ->name('asignaciones.index');

    // Lista de fechas con asignaciones
    Route::get('/asignaciones/fechas', [AsignacionTareaController::class, 'datesIndex'])
        ->name('asignaciones.fechas');

    // Mostrar tareas asignadas para una fecha concreta
    Route::get('/asignaciones/fechas/{fecha}', [AsignacionTareaController::class, 'showByFecha'])
        ->name('asignaciones.porFecha');

    // Crear una nueva asignación para un usuario en una fecha
    Route::post('/asignaciones/fechas/{fecha}/user/{user}', [AsignacionTareaController::class, 'store'])
        ->name('asignaciones.store');

    // Eliminar una asignación
    Route::delete('/asignaciones/{asignacion}', [AsignacionTareaController::class, 'destroy'])
        ->name('asignaciones.destroy');
    // Cambiar asignacion estado
    // Route::patch('/asignaciones/{asignacion}', [AsignacionTareaController::class, 'update'])
    //     ->name('asignaciones.update');
    // Grupo para “mis asignaciones”
    // Lista de fechas en que yo tengo asignaciones
    Route::get(
        '/mis-asignaciones/fechas',
        [AsignacionTareaController::class, 'myDatesIndex']
    )
        ->name('mis.asignaciones.fechas');

    // Mis tareas para una fecha concreta
    Route::get(
        '/mis-asignaciones/{fecha}',
        [AsignacionTareaController::class, 'myShowByFecha']
    )
        ->name('mis.asignaciones.porFecha');
});
Route::get('/users', function () {
    return Inertia::render('user');
});






//para la vista de marketing
Route::get('/marketing', function () {
    return Inertia::render('Marketing'); // Note the capital 'M'
});
//para la vista de marketing
Route::get('/diseño', function () {
    return Inertia::render('Diseño'); // Note the capital 'M'
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
})->name('tareas.index');


Route::get('/tareas-con-asignaciones',   [TareaController::class, 'tareasConAsignaciones']);
Route::patch('/asignaciones/{id}', [TareaController::class, 'actualizarAsignacion'])
     ->name('asignaciones.actualizar');
// PATCH /asignaciones/{id}/intercambiar
Route::patch('/asignaciones/{id}/intercambiar', [AsignacionController::class, 'intercambiarUsuario']);

// Lista mis tareas POR FECHA (vista día)
Route::get('tareas/fecha/g-{fecha}', [AsignacionTareaController::class, 'myShowByFecha'])
    ->name('tareas.fecha');













Route::get('/api/vertareas', [TareaController::class, 'vertareas']);
Route::get('/api/tareas', [TareaController::class, 'index']);
Route::get('/api/tareas-por-fecha', [TareaController::class, 'tareasPorFecha']);
Route::get('/tareas/pdf', [TareaController::class, 'generarPdfTareasAsignadas'])->name('tareas.asignadas.pdf');


Route::post('/create/tareas', [TareaController::class, 'store']);
Route::put('/tareas/{tarea}', [TareaController::class, 'update']);
Route::delete('/tareas/{tarea}', [TareaController::class, 'destroy']);
Route::get('/api/tipos', function () {
    return \App\Models\Tipo::select('id', 'nombre_tipo as nombre')->get();
});
Route::get('/api/companies', function () {
    return \App\Models\Company::select('id', 'name as nombre')->get();
});
Route::get('/api/tareas-asignadas', [TareaController::class, 'tareasAsignadas']);
Route::post('/asignar-tareas', [TareaController::class, 'asignarTareas']);



Route::get('/infuencersdatos', function () {
    return Inertia::render('influencers/infuencersdatos');
});
// Rutas para el controlador de influencers con Inertia
Route::get('/infuencersdatos', [DatoInfluencersController::class, 'index'])->name('infuencersdatos.index');
Route::post('/infuencersdatos', [DatoInfluencersController::class, 'store'])->name('infuencersdatos.store');
Route::put('/infuencersdatos/{id}', [DatoInfluencersController::class, 'update'])->name('infuencersdatos.update');
Route::delete('/infuencersdatos/{user}', [DatoInfluencersController::class, 'destroy'])->name('infuencersdatos.destroy');

Route::post('/api/datos', [DatoInfluencersController::class, 'storedato']);
Route::get('/api/roles', fn() => response()->json(Role::all()));

Route::get('/semana', [SemanaController::class, 'index']);
Route::get('/semanainfluencer', [SemanaController::class, 'indexinfluencer']);
Route::post('/asignar-influencer', [SemanaController::class, 'asignarInfluencer'])->name('asignar.influencer');
Route::post('/quitar-influencer', [SemanaController::class, 'quitarInfluencer'])->name('quitarInfluencer');
Route::get('/disponibilidad-semanal-pdf', [SemanaController::class, 'generarPdfDisponibilidad'])->name('disponibilidad.semanal.pdf');

Route::post('/infuencersdatos/{user}/photos', [DatoInfluencersController::class, 'uploadPhotos'])->name('influencers.photos.upload');
Route::delete('/infuencersdatos/{user}/photos/{photo}', [DatoInfluencersController::class, 'deletePhoto'])->name('influencers.photos.delete');
Route::get('/infuencersdatos/{user}/photos', [DatoInfluencersController::class, 'getPhotos'])->name('influencers.photos.get');
// Rutas para videos (añadir junto a las rutas de fotos existentes)
Route::post('/infuencersdatos/{user}/videos', [DatoInfluencersController::class, 'uploadVideos'])
    ->name('influencers.videos.upload');

Route::get('/infuencersdatos/{user}/videos', [DatoInfluencersController::class, 'getVideos'])
    ->name('influencers.videos.get');

Route::delete('/infuencersdatos/{user}/videos/{video}', [DatoInfluencersController::class, 'deleteVideo'])
    ->name('influencers.videos.delete');

Route::get('/api/pasantes', [PasanteController::class, 'getPasantes'])->name('api.pasantes');
Route::get('/pasante/mistareas', [PasanteController::class, 'mistareas'])->name('pasante.mistareas');
Route::get('/pasante/mistareas/todos', function () {
    return Inertia::render('pasante/mistareas');
});
Route::get('/pasante/mistareaspendientes', [PasanteController::class, 'mistareaspendientes'])->name('pasante.mistareaspendientes');

Route::get('/pasante/mistareas/pendientes', function () {
    return Inertia::render('pasante/mistareaspendientes');
});
Route::get('/pasante/mistareasenrevicion', [PasanteController::class, 'mistareasenrevicion'])->name('pasante.mistareasenrevicion');

Route::get('/pasante/mistareas/enrevicion', function () {
    return Inertia::render('pasante/mistareasenrevicion');
});
Route::get('/pasante/mistareaspublicadas', [PasanteController::class, 'mistareaspublicadas'])->name('pasante.mistareaspublicadas');

Route::get('/pasante/mistareas/publicadas', function () {
    return Inertia::render('pasante/mistareaspublicadas');
});
Route::patch('/tareas/actualizar-estado/{id}', [PasanteController::class, 'actualizarEstadoa'])->name('tareas.actualizar-estado');

Route::get('/users/{user}/photos/upload', [PhotoController::class, 'create'])->name('users.photos.upload');
Route::post('/users/{user}/photos', [PhotoController::class, 'store'])->name('photos.store');

Route::get('/tiposinfluencers', function () {
    return Inertia::render('influencers/tipoinfluencers');
})->name('tareas.index');
Route::get('/api/influencer/profile', [InfluencerController::class, 'profile']);
Route::post('/api/influencer/photos', [InfluencerController::class, 'updatePhotos']);
Route::get('/api/influencer/availability', [InfluencerController::class, 'getAvailability']);
Route::post('/api/influencer/availability', [InfluencerController::class, 'updateAvailability']);
Route::get('/api/influencer/bookings', [InfluencerController::class, 'getBookings']);
Route::get('/api/influencer/assignments', [InfluencerController::class, 'getAssignments']);


Route::get('/pasante/mistareas', [PasanteController::class, 'mistareas'])->name('pasante.mistareas');
Route::get('/pasante/mistareas/todos', function () {
    return Inertia::render('pasante/mistareas');
});
Route::get('/pasante/mistareaspendientes', [PasanteController::class, 'mistareaspendientes'])->name('pasante.mistareaspendientes');

Route::get('/pasante/mistareas/pendientes', function () {
    return Inertia::render('pasante/mistareaspendientes');
});
Route::get('/pasante/mistareasenrevicion', [PasanteController::class, 'mistareasenrevicion'])->name('pasante.mistareasenrevicion');

Route::get('/pasante/mistareas/enrevicion', function () {
    return Inertia::render('pasante/mistareasenrevicion');
});
Route::get('/pasante/mistareaspublicadas', [PasanteController::class, 'mistareaspublicadas'])->name('pasante.mistareaspublicadas');

Route::get('/pasante/mistareas/publicadas', function () {
    return Inertia::render('pasante/mistareaspublicadas');
});

Route::patch('/tareas/actualizar-estado/{id}', [PasanteController::class, 'actualizarEstadoa'])->name('tareas.actualizar-estado');


///guadalupe

Route::get('/influencersts', [InfluencerDatosController::class, 'index'])
    ->name('influencers.index');

Route::get('/influencers/{id}', [InfluencerDatosController::class, 'show'])
    ->name('influencers.show');

     Route::get('/tareas/hoy', function () {
    return Inertia::render('tareas/tareashoy');
})->name('tareas.index');

 Route::get('/tareas/revicion', function () {
    return Inertia::render('tareas/tareasrevicion');
})->name('tareas.index');

Route::patch('/asignaciones/{id}/intercambiar', [AsignacionTareaController::class, 'intercambiar']);
Route::delete('/asignacion/{id}', [TareaController::class, 'eliminarAsignacion']);
Route::patch('/asignaciones/{id}', [TareaController::class, 'update']);

/////////empresas G

Route::get('/company-links', [CompanyLinkComprobanteController::class, 'index'])->name('company-links.index');
Route::post('/company-links', [CompanyLinkComprobanteController::class, 'store'])->name('company-links.store');
Route::put('/company-links/{registro}', [CompanyLinkComprobanteController::class, 'update'])->name('company-links.update');
Route::delete('/company-links/{registro}', [CompanyLinkComprobanteController::class, 'destroy'])->name('company-links.destroy');
Route::get('/pagos', function () {
    return Inertia::render('pagos/index');
});

Route::get('/comprobantes', [PagosController::class, 'getComprobantesConCompanies']);

///pagos empresas
Route::get('/pagos-del-mes', [CompanyLinkComprobanteController::class, 'pagosDelMes'])->name('company-links.pagos-del-mes');
Route::get('/api/companies', [PagosController::class, 'getCompanies']);
Route::post('/comprobante', [PagosController::class, 'storeComprobante']);

Route::get('/reportes/pagos-por-anio', [\App\Http\Controllers\CompanyLinkComprobanteController::class, 'reporteAnual'])
    ->name('company-links.reporte-anual');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
