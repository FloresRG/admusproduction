import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/roles-permissions',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export default function RolesPermissions() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [loading, setLoading] = useState(false);

    // Obtener roles y permisos
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = () => {
        axios.get('/api/roles') // <- esta es la nueva ruta correcta
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    };
    

    const handleCreateRole = () => {
        if (!newRoleName.trim()) return alert('El nombre del rol es obligatorio');
        setLoading(true);

        axios.post('/create/roles', { name: newRoleName })
            .then(() => {
                setNewRoleName('');
                setShowModal(false);
                fetchRoles(); // Actualizar la lista de roles
            })
            .catch(error => {
                console.error('Error creating role:', error);
                alert('Hubo un error al crear el rol');
            })
            .finally(() => setLoading(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles y Permisos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Roles y Permisos</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => setShowModal(true)}
                    >
                        Crear Nuevo Rol
                    </button>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    {/* Tabla de Roles y Permisos */}
                    <div className="overflow-x-auto p-4">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Rol</th>
                                    <th className="px-4 py-2 text-left">Permisos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr key={role.id}>
                                        <td className="border px-4 py-2">{role.name}</td>
                                        <td className="border px-4 py-2">
                                            {role.permissions.length > 0 ? (
                                                <ul>
                                                    {role.permissions.map((permission) => (
                                                        <li key={permission.id}>{permission.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>No tiene permisos asignados</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para crear un nuevo rol */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Crear Nuevo Rol</h2>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded mb-4"
                            placeholder="Nombre del rol"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleCreateRole}
                                disabled={loading}
                            >
                                {loading ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}