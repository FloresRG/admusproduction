import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

interface Paquete {
    id: number;
    nombre_paquete: string;
    caracteristicas: string;
    descripcion: string;
    monto: number;
    puntos: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    paquetes: Paquete[];
    flash: {
        success?: string;
    };
}

const Index: React.FC<Props> = ({ paquetes, flash }) => {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este paquete?')) {
            router.delete(`/paquetes/${id}`);
        }
    };

    const truncateText = (text: string | null | undefined, limit: number = 50): string => {
        if (!text) return '';
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    return (
        <AppLayout>
            <Head title="Gestión de Paquetes" />

            <div
                style={{
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minHeight: '100vh',
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        padding: '30px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h1
                        style={{
                            color: '#333',
                            textAlign: 'center',
                            marginBottom: '30px',
                            fontSize: '2.5rem',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        📦 Gestión de Paquetes
                    </h1>

                    {flash.success && (
                        <div
                            style={{
                                padding: '15px',
                                marginBottom: '20px',
                                borderRadius: '10px',
                                background: 'linear-gradient(45deg, #11998e, #38ef7d)',
                                color: 'white',
                                fontWeight: 500,
                            }}
                        >
                            ✅ {flash.success}
                        </div>
                    )}

                    <Link
                        href="/paquetes/create"
                        style={{
                            padding: '12px 25px',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            fontSize: '14px',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            marginBottom: '20px',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        ➕ Crear Nuevo Paquete
                    </Link>

                    {paquetes.length > 0 ? (
                        <div
                            style={{
                                overflowX: 'auto',
                                background: 'white',
                                borderRadius: '15px',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <table
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #eee',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            ID
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #eee',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            Nombre
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #eee',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            Características
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #eee',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            Descripción
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #eee',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            Monto
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #eee',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            Puntos
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #eee',
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                            }}
                                        >
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paquetes.map((paquete) => (
                                        <tr
                                            key={paquete.id}
                                            style={{
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                                e.currentTarget.style.transform = 'scale(1.01)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                <strong>{paquete.id}</strong>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                {paquete.nombre_paquete}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                {truncateText(paquete.caracteristicas)}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                {truncateText(paquete.descripcion)}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                <strong>${paquete.monto ? Number(paquete.monto).toFixed(2) : '0.00'}</strong>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        background: '#667eea',
                                                        color: 'white',
                                                        padding: '5px 10px',
                                                        borderRadius: '15px',
                                                    }}
                                                >
                                                    {paquete.puntos}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #eee',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: '10px',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    <Link
                                                        href={`/paquetes/${paquete.id}/edit`}
                                                        style={{
                                                            padding: '8px 15px',
                                                            border: 'none',
                                                            borderRadius: '25px',
                                                            cursor: 'pointer',
                                                            textDecoration: 'none',
                                                            display: 'inline-block',
                                                            fontWeight: 600,
                                                            transition: 'all 0.3s ease',
                                                            textAlign: 'center',
                                                            fontSize: '12px',
                                                            background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                                                            color: 'white',
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        ✏️ Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(paquete.id)}
                                                        style={{
                                                            padding: '8px 15px',
                                                            border: 'none',
                                                            borderRadius: '25px',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            transition: 'all 0.3s ease',
                                                            fontSize: '12px',
                                                            background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                                                            color: 'white',
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#666',
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '15px',
                                    color: '#999',
                                }}
                            >
                                📭 No hay paquetes registrados
                            </h3>
                            <p>Crea tu primer paquete para comenzar</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
