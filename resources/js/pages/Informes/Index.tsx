import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { FaFolder, FaSearch, FaPlus, FaEdit, FaTrash, FaComment, FaEye } from 'react-icons/fa';

interface Comentario {
    id: number;
    contenido: string;
    created_at: string;
    user?: { name: string };
}

interface Informe {
    id: number;
    titulo: string;
    nombre_empresa?: string;
    estado?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    descripcion?: string;
    company?: { id: number; name: string };
    comentarios?: Comentario[];
}

const Index: React.FC<PageProps> = () => {
    const { informes, filters } = usePage().props as { informes: any; filters: { search: string } };
    const [search, setSearch] = useState(filters.search || '');

    // Modales
    const [openModal, setOpenModal] = useState(false);
    const [openComentariosModal, setOpenComentariosModal] = useState(false);
    const [comentario, setComentario] = useState('');
    const [selectedInformeId, setSelectedInformeId] = useState<number | null>(null);
    const [comentariosInforme, setComentariosInforme] = useState<Comentario[]>([]);
    const [tituloInforme, setTituloInforme] = useState('');

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar este informe?')) {
            router.delete(route('informes.destroy', id));
        }
    };

    const handleOpenModal = (informeId: number) => {
        setSelectedInformeId(informeId);
        setComentario('');
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedInformeId(null);
        setComentario('');
    };

    const handleSaveComentario = () => {
        if (!comentario || selectedInformeId === null) return;
        router.post(route('comentarios.store'), { contenido: comentario, informe_id: selectedInformeId }, {
            onSuccess: () => {
                handleCloseModal();
                alert('Comentario agregado con éxito!');
            },
        });
    };

    const handleOpenComentariosModal = (inf: Informe) => {
        setComentariosInforme(inf.comentarios ?? []);
        setTituloInforme(inf.titulo);
        setOpenComentariosModal(true);
    };

    const handleCloseComentariosModal = () => {
        setComentariosInforme([]);
        setTituloInforme('');
        setOpenComentariosModal(false);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        router.get(route('informes.index'), { search: e.target.value }, { preserveState: true, replace: true });
    };

    // Agrupar informes por empresa
    const informesPorEmpresa: Record<string, Informe[]> = informes.data.reduce(
        (acc: Record<string, Informe[]>, inf: Informe) => {
            const empresa = inf.company?.name ?? 'Sin empresa';
            if (!acc[empresa]) acc[empresa] = [];
            acc[empresa].push(inf);
            return acc;
        }, {}
    );

    const getEstadoColor = (estado: string | undefined) => {
        switch (estado?.toLowerCase()) {
            case 'completado':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'en progreso':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'pendiente':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    Gestión de Informes
                                </h1>
                                <p className="text-slate-600 mt-2">Administra y organiza todos tus informes empresariales</p>
                            </div>
                            <Link
                                href={route('informes.create')}
                                className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
                            >
                                <FaPlus className="w-4 h-4" />
                                Crear Informe
                                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar informes..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    {Object.entries(informesPorEmpresa).map(([empresa, informesEmpresa]) => (
                        <div key={empresa} className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-slate-800">{empresa}</h2>
                                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                                    {informesEmpresa.length} informe{informesEmpresa.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {informesEmpresa.map((inf: Informe) => (
                                    <div key={inf.id} className="group relative">
                                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:bg-white/95">
                                            {/* Header del card */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                                                    <FaFolder className="text-white text-xl" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                        {inf.titulo}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getEstadoColor(inf.estado)}`}>
                                                            {inf.estado ?? 'Sin estado'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Descripción */}
                                            <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                {inf.descripcion?.substring(0, 100) ?? 'Sin descripción disponible'}
                                                {inf.descripcion && inf.descripcion.length > 100 && '...'}
                                            </p>

                                            {/* Fechas */}
                                            <div className="space-y-2 mb-6">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500 font-medium">Inicio:</span>
                                                    <span className="text-slate-700 font-semibold">{inf.fecha_inicio}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500 font-medium">Fin:</span>
                                                    <span className="text-slate-700 font-semibold">{inf.fecha_fin ?? 'No definida'}</span>
                                                </div>
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href={route('informes.edit', inf.id)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                                >
                                                    <FaEdit className="w-3 h-3" />
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(inf.id)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                                >
                                                    <FaTrash className="w-3 h-3" />
                                                    Eliminar
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(inf.id)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                                                >
                                                    <FaComment className="w-3 h-3" />
                                                    Comentar
                                                </button>
                                                <button
                                                    onClick={() => handleOpenComentariosModal(inf)}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                                                >
                                                    <FaEye className="w-3 h-3" />
                                                    Ver ({inf.comentarios?.length ?? 0})
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Paginación */}
                    <div className="mt-12 flex justify-center">
                        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-slate-200/60 shadow-lg">
                            {informes.links.map((link: any, index: number) => (
                                <button
                                    key={index}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        link.active 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Modales */}
                    <Dialog 
                        open={openModal} 
                        onClose={handleCloseModal}
                        PaperProps={{
                            style: {
                                borderRadius: '16px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            }
                        }}
                    >
                        <DialogTitle className="text-xl font-bold text-slate-800 border-b border-slate-200">
                            💬 Agregar Comentario
                        </DialogTitle>
                        <DialogContent className="mt-4">
                            <TextField
                                label="Escribe tu comentario"
                                fullWidth
                                multiline
                                rows={4}
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&:hover fieldset': {
                                            borderColor: '#3b82f6',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3b82f6',
                                        },
                                    },
                                }}
                            />
                        </DialogContent>
                        <DialogActions className="p-6 gap-2">
                            <Button 
                                onClick={handleCloseModal} 
                                variant="outlined"
                                sx={{ 
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleSaveComentario} 
                                variant="contained" 
                                sx={{ 
                                    borderRadius: '8px',
                                    background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #2563eb, #5855f5)',
                                    }
                                }}
                            >
                                Guardar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog 
                        open={openComentariosModal} 
                        onClose={handleCloseComentariosModal} 
                        fullWidth 
                        maxWidth="sm"
                        PaperProps={{
                            style: {
                                borderRadius: '16px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            }
                        }}
                    >
                        <DialogTitle className="text-xl font-bold text-slate-800 border-b border-slate-200">
                            💬 Comentarios de "{tituloInforme}"
                        </DialogTitle>
                        <DialogContent dividers className="max-h-96">
                            {comentariosInforme.length > 0 ? (
                                <div className="space-y-4">
                                    {comentariosInforme.map((c) => (
                                        <div key={c.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                            <p className="text-slate-800 leading-relaxed mb-3">{c.contenido}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-medium text-slate-600">
                                                    {c.user?.name ?? 'Usuario anónimo'}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(c.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <p className="text-slate-500 text-lg">No hay comentarios para este informe</p>
                                    <p className="text-slate-400 text-sm mt-1">¡Sé el primero en comentar!</p>
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions className="p-6">
                            <Button 
                                onClick={handleCloseComentariosModal} 
                                variant="contained"
                                sx={{ 
                                    borderRadius: '8px',
                                    background: 'linear-gradient(45deg, #3b82f6, #6366f1)',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #2563eb, #5855f5)',
                                    }
                                }}
                            >
                                Cerrar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;