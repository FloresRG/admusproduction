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
        const payload = { name: newRoleName, permissions: selectedPermissions };

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
            .then(() => fetchRoles())
            .catch(error => {
                console.error('Error al eliminar el rol:', error);
                alert('Hubo un error al eliminar el rol');
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles y Permisos" />

            <div className="flex flex-col gap-6 p-6 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                        Roles y Permisos
                    </h1>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition"
                        onClick={openCreateModal}
                    >
                        Crear Nuevo Rol
                    </button>
                </div>

                <div className="bg-white border rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Rol</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Permisos</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-800">{role.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {role.permissions.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {role.permissions.map((p) => (
                                                    <li key={p.id}>{p.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="italic text-gray-400">No tiene permisos asignados</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-3">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                            onClick={() => openEditModal(role)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 font-medium"
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

            {/* Modal sin fondo oscuro */}
            {showModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEditMode ? 'Editar Rol' : 'Crear Nuevo Rol'}
                        </h2>

                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Nombre del rol"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                        />

                        <h3 className="font-semibold text-sm text-gray-700">Permisos</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            {allPermissions.map((perm) => (
                                <label key={perm.id} className="flex items-center space-x-2 text-sm text-gray-800">
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

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md transition"
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                className={`bg-blue-600 text-white px-4 py-2 rounded-md transition shadow-md ${
                                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                }`}
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
