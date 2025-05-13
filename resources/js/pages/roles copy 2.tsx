import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles y Permisos',
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
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editRoleId, setEditRoleId] = useState<number | null>(null);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = () => {
        axios.get('/api/roles')
            .then(response => setRoles(response.data))
            .catch(error => console.error('Error fetching roles:', error));
    };

    const fetchPermissions = () => {
        axios.get('/api/permissions')
            .then(response => setAllPermissions(response.data))
            .catch(error => console.error('Error fetching permissions:', error));
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setNewRoleName('');
        setSelectedPermissions([]);
        setShowModal(true);
    };

    const openEditModal = (role: Role) => {
        setIsEditMode(true);
        setEditRoleId(role.id);
        setNewRoleName(role.name);
        setSelectedPermissions(role.permissions.map(p => p.name));
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!newRoleName.trim()) return alert('El nombre del rol es obligatorio');
        setLoading(true);

        const payload = {
            name: newRoleName,
            permissions: selectedPermissions,
        };

        const request = isEditMode
            ? axios.put(`/roles/${editRoleId}`, payload)
            : axios.post('/create/roles', payload);

        request
            .then(() => {
                setShowModal(false);
                setNewRoleName('');
                setSelectedPermissions([]);
                fetchRoles();
            })
            .catch(error => {
                console.error('Error guardando el rol:', error);
                alert('Hubo un error');
            })
            .finally(() => setLoading(false));
    };
    const handleDeleteRole = (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este rol?')) return;
    
        axios.delete(`/roles/${id}`)
            .then(() => {
                fetchRoles(); // recargar lista
            })
            .catch(error => {
                console.error('Error al eliminar el rol:', error);
                alert('Hubo un error al eliminar el rol');
            });
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles y Permisos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Roles y Permisos</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={openCreateModal}
                    >
                        Crear Nuevo Rol
                    </button>
                </div>

                <div className="border relative flex-1 overflow-hidden rounded-xl">
                    <div className="overflow-x-auto p-4">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Rol</th>
                                    <th className="px-4 py-2 text-left">Permisos</th>
                                    <th className="px-4 py-2 text-left">Acciones</th>
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
                                        <td className="border px-4 py-2 space-x-2">
    <button
        className="text-blue-600 hover:underline"
        onClick={() => openEditModal(role)}
    >
        Editar
    </button>
    <button
        className="text-red-600 hover:underline"
        onClick={() => handleDeleteRole(role.id)}
    >
        Eliminar
    </button>
</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">
                            {isEditMode ? 'Editar Rol' : 'Crear Nuevo Rol'}
                        </h2>

                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded mb-4"
                            placeholder="Nombre del rol"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                        />

                        <h3 className="font-semibold mb-2">Permisos</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-4">
                            {allPermissions.map((perm) => (
                                <label key={perm.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={perm.name}
                                        checked={selectedPermissions.includes(perm.name)}
                                        onChange={(e) => {
                                            const { checked, value } = e.target;
                                            setSelectedPermissions(prev =>
                                                checked
                                                    ? [...prev, value]
                                                    : prev.filter(p => p !== value)
                                            );
                                        }}
                                    />
                                    <span>{perm.name}</span>
                                </label>
                            ))}
                        </div>

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
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
