<?php

use App\Http\Controllers\AsignacionTareaController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CamarografoController;
use App\Http\Controllers\CanjeController;
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
use App\Http\Controllers\EditorController;
use App\Http\Controllers\HorarioPersonalController;
use App\Http\Controllers\InfluencerAvailabilityController;
use App\Http\Controllers\InfluencerController;
use App\Http\Controllers\InfluencerDatosController;
use App\Http\Controllers\InformeController;
use App\Http\Controllers\InicioController;
use App\Http\Controllers\MarketingController;
use App\Http\Controllers\PagosController;
use App\Http\Controllers\PaqueteController;
use App\Http\Controllers\PasanteController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\PlanEmpresaController;
use App\Http\Controllers\PremioController;
use App\Http\Controllers\ReporteVentaController;
use App\Http\Controllers\SeguimientoEmpresaController;
use App\Http\Controllers\SeguimientoEmpresaVendedorController;
use App\Http\Controllers\SemanaController;
use App\Http\Controllers\SemanaPasantesController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\TipoController;
use App\Http\Controllers\VideosController;
use App\Http\Controllers\WeekController;
use App\Models\Company;

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
    Route::patch('/companies/{company}/estado', [CompanyController::class, 'toggleEstado']);
    Route::get('/users', function () {
        return Inertia::render('user');
    });

    Route::prefix('companiasmark')->group(function () {
        Route::get('/', [CompanyController::class, 'indexmark'])->name('indexmark');
        Route::get('/create', [CompanyController::class, 'createmark'])->name('createmark');
        Route::post('/', [CompanyController::class, 'storemark'])->name('storemark');
        Route::get('{id}/edit', [CompanyController::class, 'editmark'])->name('editmark');
        Route::put('{id}', [CompanyController::class, 'updatemark'])->name('updatemark');
        Route::delete('{company}', [CompanyController::class, 'destroymark'])->name('destroymark');
    });
    Route::patch('/companiasm/{company}/estado', [CompanyController::class, 'toggleEstado']);
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
Route::post('/clear-availabilities', [InfluencerAvailabilityController::class, 'clearAll']);
Route::get('/vertareas', function () {
    return Inertia::render('tareas/vertareas');
});
Route::get('/tareas', function () {
    return Inertia::render('tareas/index');
})->name('tareas.index');
Route::patch('/tareas/{id}/descripcion', [TareaController::class, 'actualizarDescripcion']);
///intercambiar user
Route::delete('/asignaciones/reasignar/{id}', [TareaController::class, 'reasignarUsuario'])->middleware('auth');

///empresas
Route::get('/empresas', [TareaController::class, 'listarEmpresas']);


Route::get('/tareas-con-asignaciones',   [TareaController::class, 'tareasConAsignaciones']);
Route::patch('/asignaciones/{id}', [TareaController::class, 'actualizarAsignacion'])
    ->name('asignaciones.actualizar');

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
Route::put('/infuencersdatos/{user}/datos/{photo}', [DatoInfluencersController::class, 'updateInfluencerData']);
// Rutas para el controlador de influencers con Inertia
Route::get('/infuencersdatos', [DatoInfluencersController::class, 'index'])->name('infuencersdatos.index');
Route::post('/infuencersdatos', [DatoInfluencersController::class, 'store'])->name('infuencersdatos.store');
Route::put('/infuencersdatos/{id}', [DatoInfluencersController::class, 'update'])->name('infuencersdatos.update');
Route::delete('/infuencersdatos/{user}', [DatoInfluencersController::class, 'destroy'])->name('infuencersdatos.destroy');

Route::post('/api/datos', [DatoInfluencersController::class, 'storedato']);
Route::get('/api/roles', fn() => response()->json(Role::all()));

Route::get('/semana', [SemanaController::class, 'index']);
Route::get('/mes', [SemanaController::class, 'indexMensual']);
Route::get('/semanainfluencer', [SemanaController::class, 'indexinfluencer']);
Route::post('/asignar-influencer', [SemanaController::class, 'asignarInfluencer'])->name('asignar.influencer');
Route::post('/quitar-influencer', [SemanaController::class, 'quitarInfluencer'])->name('quitarInfluencer');
Route::get('/disponibilidad-semanal-pdf', [SemanaController::class, 'generarPdfDisponibilidad'])->name('disponibilidad.semanal.pdf');
Route::post('/asignar-empresas-masivamente', [SemanaController::class, 'asignarEmpresasMasivamente'])
    ->middleware('auth')
    ->name('asignar.empresas.masivo');
Route::post('/agregar-disponibilidad-empresa', [SemanaController::class, 'agregarDisponibilidadEmpresa']);
Route::post('/quitar-disponibilidad-empresa', [SemanaController::class, 'quitarDisponibilidadEmpresa']);

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

//rutas de cupones
Route::put('/infuencersdatos/{user}/videos/{photo}/cupon', [InfluencerController::class, 'updateVideoCoupon']);
Route::get('/videos-with-coupons', [InfluencerController::class, 'getVideosWithCoupons']);

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

Route::get('/perfil-influencer', [InfluencerController::class, 'index'])
    ->name('influencer.profile');
Route::get('/reportetareas', [AsignacionTareaController::class, 'reportetareas'])->name('asignaciones.reportetareas');
Route::get('/reportetareas/pdf', [AsignacionTareaController::class, 'generarPdfReporteTareas'])->name('reportetareas.pdf');
Route::get('/reportetareas/pdfmes', [AsignacionTareaController::class, 'generarPdfReporteTareasmes'])->name('reportetareas.pdfmes');


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
Route::get('/pasante/mistareasencorregir', [PasanteController::class, 'mistareasencorregir'])->name('pasante.mistareasencorregir');

Route::get('/pasante/mistareas/encorregir', function () {
    return Inertia::render('pasante/mistareasencorregir');
});

Route::get('/pasante/mistareaspublicadas', [PasanteController::class, 'mistareaspublicadas'])->name('pasante.mistareaspublicadas');

Route::get('/pasante/mistareas/publicadas', function () {
    return Inertia::render('pasante/mistareaspublicadas');
});

Route::get('/tareaspublicadas', [MarketingController::class, 'tareaspublicadas'])->name('marketing.tareaspublicadas');

Route::get('/tareas/publicadas', function () {
    return Inertia::render('marketing/tareaspublicadas');
});
Route::get('/tareaspendientes', [MarketingController::class, 'tareaspendientes'])->name('marketing.tareaspendientes');

Route::get('/tareas/pendientes', function () {
    return Inertia::render('marketing/tareaspendientes');
});
Route::patch('/tareas/actualizar-estado/{id}', [PasanteController::class, 'actualizarEstadoa'])->name('tareas.actualizar-estado');


///guadalupe

Route::get('/influencersts', [InfluencerDatosController::class, 'index'])
    ->name('influencers.index');

//videos portafolio
Route::get('/videosportafolio', [InfluencerDatosController::class, 'videosportafolio'])
    ->name('videosportafolio.videosportafolio');
Route::get('/companiesvideos/{company}', [InfluencerDatosController::class, 'showvideos'])->name('companiesvideos.showvideos');

Route::get('/influencers/{id}', [InfluencerDatosController::class, 'show'])
    ->name('influencers.show');

Route::get('/tareas/hoy', function () {
    return Inertia::render('tareas/tareashoy');
})->name('tareas.index');

Route::get('/tareas/dehoy', function () {
    return Inertia::render('marketing/tareasdehoy');
})->name('tareas.index');

Route::get('/tareas/revicion', function () {
    return Inertia::render('tareas/tareasrevicion');
})->name('tareas.index');
Route::get('/tareas/enrevicion', function () {
    return Inertia::render('marketing/tareasenrevicion');
})->name('tareas.index');

Route::patch('/asignaciones/{id}/intercambiar', [AsignacionTareaController::class, 'intercambiar']);
Route::delete('/asignacion/{id}', [TareaController::class, 'eliminarAsignacion']);
// Route::patch('/asignaciones/{id}', [TareaController::class, 'update']);
// API
Route::get('/tareas-semana', [\App\Http\Controllers\TareaController::class, 'tareasSemana']);

// VISTA
Route::get('/tareas/semanatareas', function () {
    return Inertia::render('tareas/semanatareas');
});


/////////empresas G

Route::get('/company-links', [CompanyLinkComprobanteController::class, 'index'])->name('company-links.index');
Route::get('/empresa-links', [CompanyLinkComprobanteController::class, 'indexMarketing'])->name('empresa-links.index');
Route::post('/company-links', [CompanyLinkComprobanteController::class, 'store'])->name('company-links.store');
Route::put('/company-links/{registro}', [CompanyLinkComprobanteController::class, 'update'])->name('company-links.update');
Route::delete('/company-links/{registro}', [CompanyLinkComprobanteController::class, 'destroy'])->name('company-links.destroy');
Route::get('/pagos', function () {
    return Inertia::render('pagos/index');
});


//nuevocomporbante
Route::get('/pagos', [PagosController::class, 'index'])->name('pagos.index');
Route::post('/pagos', [PagosController::class, 'store'])->name('pagos.store');
Route::put('/pagos/{id}', [PagosController::class, 'update'])->name('pagos.update');


Route::get('/comprobantes', [PagosController::class, 'getComprobantesConCompanies']);

///pagos empresas
Route::get('/pagos-del-mes', [CompanyLinkComprobanteController::class, 'pagosDelMes'])->name('company-links.pagos-del-mes');
Route::get('/api/companies2', [PagosController::class, 'getCompanies']);
Route::post('/comprobante', [PagosController::class, 'storeComprobante']);
// Ruta para mostrar todos los videos
Route::get('/videos', [VideosController::class, 'index'])->name('videos.index');
Route::get('/videosmes', [VideosController::class, 'indexmes'])->name('videos.indexmes');

Route::get('/reportes/pagos-por-anio', [\App\Http\Controllers\CompanyLinkComprobanteController::class, 'reporteAnual'])
    ->name('company-links.reporte-anual');

///tareas para si mismos
Route::post('/tareas-personales', [TareaController::class, 'storePersonal'])->name('tareas-personales');
Route::get('/tareas-personales', function () {
    return Inertia::render('tareas/mistareas'); // Tu componente Vue o React aquí
})->name('tareas-personales');

Route::get('/estadisticas-mes-actual', [TareaController::class, 'estadisticasMesActual']);
Route::get('/estadisticas-completas', [TareaController::class, 'estadisticasCompletas']);


// routes/api.php
Route::get('/companias', function () {
    return Company::select('id', 'name', 'logo')
        ->whereNotNull('logo')
        ->limit(6)
        ->get()
        ->map(function ($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                'logo' => asset('storage/' . $company->logo) // Ajusta la ruta según tu configuración
            ];
        });
});

Route::get('/semanapasante', [SemanaController::class, 'indexpasante']);

Route::get('/semana-pasantes', [SemanaPasantesController::class, 'index'])->name('semana-pasantes.index');
Route::post('/asignacion-pasantes', [SemanaPasantesController::class, 'store'])->name('asignacion-pasantes.store');
Route::delete('/asignacion-pasantes/{id}', [SemanaPasantesController::class, 'destroy'])->name('asignacion-pasantes.destroy');
Route::get('/asignaciones-week/{weekId}', [SemanaPasantesController::class, 'getAsignacionesByWeek'])->name('asignaciones.by-week');
Route::get('/generar-pdf-disponibilidad', [SemanaPasantesController::class, 'generarPdfDisponibilidad'])->name('generar.pdf');

/* // Agregar estas rutas a tu archivo routes/web.php
Route::prefix('seguimiento-empresa')->name('seguimiento-empresa.')->group(function () {
    Route::get('/', [SeguimientoEmpresaController::class, 'index'])->name('index');
    Route::post('/', [SeguimientoEmpresaController::class, 'store'])->name('store');
    Route::put('/{seguimientoEmpresa}', [SeguimientoEmpresaController::class, 'update'])->name('update');
    Route::delete('/{seguimientoEmpresa}', [SeguimientoEmpresaController::class, 'destroy'])->name('destroy');
}); */
Route::middleware(['auth'])->group(function () {
    Route::resource('seguimiento-empresa', SeguimientoEmpresaController::class);
    Route::get('/seguimientos-empresa/pdf', [SeguimientoEmpresaController::class, 'generarPdf'])->name('seguimiento-empresa.pdf');
    Route::get('/seguimiento-historial', [SeguimientoEmpresaController::class, 'historial'])
        ->name('seguimiento.historial');
});
Route::middleware(['auth'])->group(function () {
    // Rutas básicas del resource
    Route::get('/seguimiento-empresa-vendedor', [SeguimientoEmpresaVendedorController::class, 'index'])
        ->name('seguimiento-empresa-vendedor.index');

    Route::post('/seguimiento-empresa-vendedor', [SeguimientoEmpresaVendedorController::class, 'store'])
        ->name('seguimiento-empresa-vendedor.store');
    Route::put('/reporte-empresa-vendedor/{seguimiento_empresa}', [SeguimientoEmpresaVendedorController::class, 'update'])
        ->name('seguimiento-empresa-vendedor.update');
    Route::delete('/reporte-empresa-vendedor/{seguimiento_empresa}', [SeguimientoEmpresaVendedorController::class, 'destroy'])
        ->name('seguimiento-empresa-vendedor.destroy');
    Route::put('/reporte-empresa-vendedor/{seguimiento_empresa}/finalize', [SeguimientoEmpresaVendedorController::class, 'finalize'])
        ->name('seguimiento-empresa-vendedor.finalize');
    Route::put('/reporte-empresa-vendedor/{seguimiento_empresa}/cancel', [SeguimientoEmpresaVendedorController::class, 'cancel'])
        ->name('seguimiento-empresa-vendedor.cancel');
});

// Rutas para el CRUD de paquetes
Route::resource('paquetes', PaqueteController::class);
Route::resource('premios', PremioController::class);
// Rutas de canjes
Route::middleware(['auth'])->group(function () {
    Route::get('/canjes', [CanjeController::class, 'index'])->name('canjes.index');
    Route::post('/canjes', [CanjeController::class, 'store'])->name('canjes.store');
    Route::get('/canjes/historial', [CanjeController::class, 'historial'])->name('canjes.historial');
    Route::get('/canjes/pendientes', [CanjeController::class, 'pendientes'])->name('canjes.pendientes');
    Route::post('/canjes/{canje}/recoger', [CanjeController::class, 'marcarRecogido'])->name('canjes.marcar-recogido');
});
Route::resource('informes', InformeController::class);
Route::post('/comentarios', [InformeController::class, 'comentario'])->name('comentarios.store');

// OPCIÓN 1: Validar directamente en el controlador (más simple)
Route::middleware(['auth'])->group(function () {
    Route::get('/mi-horario', [HorarioPersonalController::class, 'index'])->name('horario.personal');
});
Route::get('/planes-empresas', [PlanEmpresaController::class, 'index'])->name('planes.empresas.index');
Route::get('/seguimiento', [PlanEmpresaController::class, 'seguimiento'])->name('seguimiento');
Route::get('/empresas/{empresa}/seguimiento-tareas', [PlanEmpresaController::class, 'seguimientoTareas'])->name('empresas.seguimiento-tareas');
Route::post('/empresa/{empresaId}/tareas/generar', [PlanEmpresaController::class, 'generarTareas'])
    ->name('tareas.generar');
Route::patch('/tareas/{tarea}/actualizar', [PlanEmpresaController::class, 'actualizarTarea'])->name('tareas.actualizar');
Route::post('/empresas/{empresa}/tareas/crear', [PlanEmpresaController::class, 'crear'])->name('tareas.crear');

Route::get('/seguimiento-tareas-todos', [PlanEmpresaController::class, 'seguimientoTareasTodos'])
    ->name('seguimiento-tareas-todos');
Route::get('/seguimiento-tareas-pendientes', [PlanEmpresaController::class, 'seguimientoTareasPendientes'])
    ->name('seguimiento-tareas-pendientes');
Route::get('/seguimiento-tareas-pendienteshoy', [PlanEmpresaController::class, 'seguimientoTareasPendientesHoy'])
    ->name('seguimiento-tareas-pendienteshoy');
Route::get('/seguimiento-tareas-pendienteshoyproduccion', [PlanEmpresaController::class, 'seguimientoTareasPendientesHoyProduccion'])
    ->name('seguimiento-tareas-pendienteshoyproduccion');
Route::get('/seguimiento-tareas-pendienteshoyedicion', [PlanEmpresaController::class, 'seguimientoTareasPendientesHoyEdicion'])
    ->name('seguimiento-tareas-pendienteshoyedicion');
Route::get('/seguimiento-tareas-pendienteshoyrevision', [PlanEmpresaController::class, 'seguimientoTareasPendientesHoyEdicionRevision'])
    ->name('seguimiento-tareas-pendienteshoyrevision');
Route::get('/seguimiento-tareas-publicados', [PlanEmpresaController::class, 'seguimientoTareasPublicados'])
    ->name('seguimiento-tareas-publicados');

//nurvas rutas camarografo
Route::get('/tareas-camarografo', [CamarografoController::class, 'tareasSemanaActual'])
    ->middleware(['auth'])
    ->name('tareas.semana');
Route::put('/tareas/{id}/completar', [CamarografoController::class, 'marcarComoCompletada'])
    ->middleware(['auth', 'verified'])
    ->name('tareas.completar');
Route::get('/camarografo/tareas-hoy', [CamarografoController::class, 'tareasHoy'])->name('tareas.hoy');
//nurvas rutas editor
Route::get('/tareas-editor', [EditorController::class, 'tareasSemanaActual'])
    ->middleware(['auth'])
    ->name('tareaseditor.semana');
Route::put('/tareaseditor/{id}/completar', [EditorController::class, 'marcarComoCompletada'])
    ->middleware(['auth', 'verified'])
    ->name('tareaseditor.completar');
Route::get('/editor/tareas-hoy', [EditorController::class, 'tareasHoy'])->name('tareaseditor.hoy');
Route::middleware(['auth'])->group(function () {
    Route::get('/reportes', [ReporteVentaController::class, 'index'])->name('reportes.index');
    Route::get('/reportesgeneral', [ReporteVentaController::class, 'indexgeneral'])->name('reportes.indexgeneral');
    Route::get('/reportes/crear', [ReporteVentaController::class, 'create'])->name('reportes.create');
    Route::post('/reportes', [ReporteVentaController::class, 'store'])->name('reportes.store');
    Route::get('/reportes/{id}', [ReporteVentaController::class, 'show'])->name('reportes.show');
    Route::get('/reportesuser/{id}', [ReporteVentaController::class, 'showuser'])->name('reportes.showuser');
    Route::get('/reportes/{id}/pdf', [ReporteVentaController::class, 'pdf'])->name('reportes.pdf');
    Route::get('/reportes/{id}/editar', [ReporteVentaController::class, 'edit'])->name('reportes.edit');
    // También necesitarás la ruta para actualizar:
    Route::put('/reportes/{id}', [ReporteVentaController::class, 'update'])->name('reportes.update');


});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
