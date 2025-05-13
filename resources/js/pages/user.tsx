import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios y Roles',
        href: '/users-roles',
    },
];

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

export default function UsersPermissions() {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = () => {
        axios.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    };

    const fetchRoles = () => {
        axios.get('/api/roles')
            .then(response => setRoles(response.data))
            .catch(error => console.error('Error fetching roles:', error));
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setSelectedRole(null);
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setIsEditMode(true);
        setEditUserId(user.id);
        setNewUserName(user.name);
        setNewUserEmail(user.email);
        setSelectedRole(user.roles[0]?.name || null);
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!newUserName.trim() || !newUserEmail.trim() || (!isEditMode && !newUserPassword.trim()) || !selectedRole) {
            return alert('Todos los campos son obligatorios');
        }

        setLoading(true);

        const payload = {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            role: selectedRole,
        };

        const request = isEditMode
            ? axios.put(`/users/${editUserId}`, payload)
            : axios.post('/users', payload);

        request
            .then(() => {
                setShowModal(false);
                fetchUsers();
            })
            .catch(error => {
                console.error('Error guardando el usuario:', error);
                alert('Hubo un error');
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteUser = (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

        axios.delete(`/users/${id}`)
            .then(() => fetchUsers())
            .catch(error => {
                console.error('Error al eliminar el usuario:', error);
                alert('Hubo un error al eliminar el usuario');
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios y Roles" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                        Usuarios y Roles
                    </h1>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition"
                        onClick={openCreateModal}
                    >
                        Crear Nuevo Usuario
                    </button>
                </div>

                <div className="bg-white border rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{user.roles[0]?.name}</td>
                                    <td className="px-6 py-4 text-sm space-x-3">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                            onClick={() => openEditModal(user)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 font-medium"
                                            onClick={() => handleDeleteUser(user.id)}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                        </h2>

                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Nombre del usuario"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Email del usuario"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                        {!isEditMode && (
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Contraseña"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                            />
                        )}
                        <select
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedRole || ''}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">Seleccionar rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </select>

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
