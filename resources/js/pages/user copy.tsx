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
        if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim() || !selectedRole) {
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
            .then(() => {
                fetchUsers(); // recargar lista
            })
            .catch(error => {
                console.error('Error al eliminar el usuario:', error);
                alert('Hubo un error al eliminar el usuario');
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios y Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Usuarios y Roles</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={openCreateModal}
                    >
                        Crear Nuevo Usuario
                    </button>
                </div>

                <div className="border relative flex-1 overflow-hidden rounded-xl">
                    <div className="overflow-x-auto p-4">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Nombre</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Rol</th>
                                    <th className="px-4 py-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="border px-4 py-2">{user.name}</td>
                                        <td className="border px-4 py-2">{user.email}</td>
                                        <td className="border px-4 py-2">{user.roles[0]?.name}</td>
                                        <td className="border px-4 py-2 space-x-2">
                                            <button
                                                className="text-blue-600 hover:underline"
                                                onClick={() => openEditModal(user)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="text-red-600 hover:underline"
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
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">
                            {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                        </h2>

                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded mb-4"
                            placeholder="Nombre del usuario"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            className="w-full border px-3 py-2 rounded mb-4"
                            placeholder="Email del usuario"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="w-full border px-3 py-2 rounded mb-4"
                            placeholder="Contraseña"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                        />

                        <select
                            className="w-full border px-3 py-2 rounded mb-4"
                            value={selectedRole || ''}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">Seleccionar rol</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </select>

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
