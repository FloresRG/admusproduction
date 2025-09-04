import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { FaFolder } from 'react-icons/fa';

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

    // Funciones
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

        router.post(
            route('comentarios.store'),
            { contenido: comentario, informe_id: selectedInformeId },
            {
                onSuccess: () => {
                    handleCloseModal();
                    alert('Comentario agregado con éxito!');
                },
            },
        );
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

    // Buscador en tiempo real
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        router.get(route('informes.index'), { search: e.target.value }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Listado de Informes</h1>
                    <Link
                        href={route('informes.create')}
                        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Crear Informe
                    </Link>
                </div>

                {/* Buscador */}
                <div className="mb-6">
                    <TextField
                        label="Buscar informes..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearch}
                        className="w-64"
                    />
                </div>

                {/* Grid tipo carpetas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {informes.data.map((inf: Informe) => (
                        <div key={inf.id} className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
                            <div className="flex items-center space-x-3 mb-3">
                                <FaFolder className="text-yellow-500 text-3xl" />
                                <div>
                                    <h3 className="text-lg font-semibold">{inf.titulo}</h3>
                                    <p className="text-sm text-gray-500">{inf.company?.name ?? 'Sin empresa'}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-2">{inf.descripcion?.substring(0, 80) ?? '-'}</p>
                            <p className="text-xs text-gray-400 mb-2">
                                Estado: {inf.estado ?? '-'} | Inicio: {inf.fecha_inicio} | Fin: {inf.fecha_fin ?? '-'}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Link
                                    href={route('informes.edit', inf.id)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(inf.id)}
                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => handleOpenModal(inf.id)}
                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                >
                                    Agregar Comentario
                                </button>
                                <button
                                    onClick={() => handleOpenComentariosModal(inf)}
                                    className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                                >
                                    Ver Comentarios
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginación */}
                <div className="mt-6 flex justify-center space-x-2">
                    {informes.links.map((link: any, index: number) => (
                        <button
                            key={index}
                            className={`px-3 py-1 rounded ${
                                link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

                {/* Modal Agregar Comentario */}
                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>Agregar Comentario</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Comentario"
                            fullWidth
                            multiline
                            rows={4}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
                        <Button onClick={handleSaveComentario} variant="contained" color="primary">Guardar</Button>
                    </DialogActions>
                </Dialog>

                {/* Modal Ver Comentarios */}
                <Dialog open={openComentariosModal} onClose={handleCloseComentariosModal} fullWidth maxWidth="sm">
                    <DialogTitle>Comentarios de "{tituloInforme}"</DialogTitle>
                    <DialogContent dividers>
                        {comentariosInforme.length > 0 ? (
                            comentariosInforme.map((c) => (
                                <div key={c.id} className="mb-4 border-b border-gray-200 pb-2">
                                    <p className="text-gray-800">{c.contenido}</p>
                                    <p className="text-xs text-gray-500">
                                        {c.user?.name ?? 'Usuario'} - {new Date(c.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No hay comentarios para este informe.</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseComentariosModal} color="primary">Cerrar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default Index;
