import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Importamos el DataTable y su tipo de columna
import { DataTable, DataTableColumn } from '@/components/ui/data-table/data-table';

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
        axios
            .get('/api/users')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error('Error fetching users:', error));
    };

    const fetchRoles = () => {
        axios
            .get('/api/roles')
            .then((response) => setRoles(response.data))
            .catch((error) => console.error('Error fetching roles:', error));
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

        const request = isEditMode ? axios.put(`/users/${editUserId}`, payload) : axios.post('/users', payload);

        request
            .then(() => {
                setShowModal(false);
                fetchUsers();
            })
            .catch((error) => {
                console.error('Error guardando el usuario:', error);
                alert('Hubo un error');
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteUser = (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

        axios
            .delete(`/users/${id}`)
            .then(() => fetchUsers())
            .catch((error) => {
                console.error('Error al eliminar el usuario:', error);
                alert('Hubo un error al eliminar el usuario');
            });
    };

    // ——————————————————————————————————————————————
    // 1. Definición de columnas para DataTable
    const userColumns: DataTableColumn[] = [
        { id: 'name', header: 'Nombre', accessorKey: 'name', enableSorting: true },
        { id: 'email', header: 'Email', accessorKey: 'email', enableSorting: true },
        { id: 'role', header: 'Rol', accessorKey: 'role', enableSorting: true },
    ];

    // 2. Transformación de los datos recibidos a un array plano
    const tableData = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.roles[0]?.name || '—',
    }));
    // ——————————————————————————————————————————————

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios y Roles" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Usuarios y Roles</h1>
                    <button className="rounded-md bg-blue-600 px-5 py-2 text-white shadow transition hover:bg-blue-700" onClick={openCreateModal}>
                        Crear Nuevo Usuario
                    </button>
                </div>

                {/* ——————————————————————————————————————————————
            3. Reemplazamos la tabla HTML por el componente DataTable
        —————————————————————————————————————————————— */}
                <div className="rounded-lg border bg-white p-4 shadow">
                    <DataTable
                        columns={userColumns}
                        data={tableData}
                        itemsPerPage={5}
                        onRowSelect={(rows) => console.log('Filas seleccionadas:', rows)}
                        title="Listado de Usuarios"
                    />
                </div>
            </div>

            {/* Modal (sin cambios) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-gray-800">{isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                        <input
                            type="text"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre del usuario"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                        />
                        <input
                            type="email"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email del usuario"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                        {!isEditMode && (
                            <input
                                type="password"
                                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contraseña"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                            />
                        )}
                        <select
                            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedRole || ''}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">Seleccionar rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                className="rounded-md bg-gray-300 px-4 py-2 transition hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                className={`rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition ${
                                    loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'
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
