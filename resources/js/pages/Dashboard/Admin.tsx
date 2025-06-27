'use client';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Estilos CSS en el mismo archivo
const styles = {
    container: {
        backgroundColor: '#ffffff',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
        marginBottom: '32px',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 8px 0',
    },
    subtitle: {
        fontSize: '16px',
        color: '#6b7280',
        margin: 0,
    },
    grid: {
        display: 'grid',
        gap: '24px',
        marginBottom: '32px',
    },
    gridCols4: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    },
    gridCols3: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    gridCols2: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb',
    },
    cardBlue: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    cardGreen: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    cardYellow: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    cardPurple: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    cardRed: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        margin: 0,
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: 'bold',
        margin: '8px 0',
    },
    statLabel: {
        fontSize: '14px',
        opacity: 0.8,
        margin: 0,
    },
    icon: {
        width: '32px',
        height: '32px',
        opacity: 0.8,
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '8px',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b82f6',
        borderRadius: '4px',
        transition: 'width 0.3s ease',
    },
    circularProgress: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
    },
    barChart: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    barItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    barLabel: {
        minWidth: '80px',
        fontSize: '14px',
        color: '#6b7280',
    },
    barContainer: {
        flex: 1,
        height: '20px',
        backgroundColor: '#f3f4f6',
        borderRadius: '10px',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: '10px',
        transition: 'width 0.5s ease',
    },
    barValue: {
        minWidth: '30px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: '#f0f9ff',
        color: '#0369a1',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
        border: '1px solid #bae6fd',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        fontSize: '18px',
        color: '#6b7280',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '32px 0 16px 0',
    },
    summaryCard: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '2px solid #e2e8f0',
    },
    summaryNumber: {
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#1e40af',
        margin: '0 0 8px 0',
    },
    summaryLabel: {
        fontSize: '16px',
        color: '#64748b',
        margin: 0,
    },
};

// Componente de progreso circular
const CircularProgress = ({ percentage, size = 120, color = '#3b82f6' }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div style={styles.circularProgress}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                </svg>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                    }}
                >
                    {percentage}%
                </div>
            </div>
        </div>
    );
};

// Iconos SVG simples
const Icons = {
    FileText: () => (
        <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
    ),
    CheckCircle: () => (
        <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
        </svg>
    ),
    Clock: () => (
        <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
        </svg>
    ),
    Users: () => (
        <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C18.67,14 24,15.33 24,18V20H8V18C8,15.33 13.33,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C10.67,14 16,15.33 16,18V20H0V18C0,15.33 5.33,14 8,14Z" />
        </svg>
    ),
    Activity: () => (
        <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M3,12H7L9,18L15,6L17,12H21" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Eye: () => (
        <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
        </svg>
    ),
    Settings: () => (
        <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
    ),
};

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/estadisticas-completas')
            .then((response) => {
                console.log('DATA LLEGADA DEL BACKEND:', response.data);
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <Head title="Dashboard de Tareas y Usuarios" />
                <div style={styles.loading}>
                    <div>Cargando estadísticas...</div>
                </div>
            </AppLayout>
        );
    }

    if (!data) return null;

    // Cálculos basados ÚNICAMENTE en los datos reales que llegan
    const totalTareas = data.tareas?.total || 0;
    const tareasPublicadas = data.tareas?.publicada || 0;
    const tareasEnRevision = data.tareas?.en_revision || 0;
    const tareasPendientes = data.tareas?.pendiente || 0;
    const totalUsuarios = data.usuarios?.total_usuarios || 0;
    const totalRoles = data.usuarios?.total_roles || 0;

    // Porcentajes calculados con datos reales
    const porcentajePublicadas = totalTareas > 0 ? Math.round((tareasPublicadas / totalTareas) * 100) : 0;
    const porcentajeEnRevision = totalTareas > 0 ? Math.round((tareasEnRevision / totalTareas) * 100) : 0;
    const porcentajePendientes = totalTareas > 0 ? Math.round((tareasPendientes / totalTareas) * 100) : 0;

    // Datos para gráfico de barras usando datos reales
    const datosBarras = [
        { label: 'Publicadas', value: tareasPublicadas, color: '#10b981' },
        { label: 'En Revisión', value: tareasEnRevision, color: '#f59e0b' },
        { label: 'Pendientes', value: tareasPendientes, color: '#6b7280' },
    ];

    const maxValue = Math.max(...datosBarras.map((item) => item.value));

    return (
        <AppLayout>
            <Head title="Dashboard de Tareas y Usuarios" />
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={styles.title}>Dashboard de Gestión</h1>
                        </div>
                        <div style={styles.badge}>
                            <Icons.Activity />
                            Sistema Activo
                        </div>
                    </div>
                </div>

                {/* Estadísticas de Usuarios */}
                <h2 style={styles.sectionTitle}>👥 Estadísticas de Usuarios</h2>
                <div style={{ ...styles.grid, ...styles.gridCols2 }}>
                    <div style={{ ...styles.card, ...styles.cardPurple, color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ ...styles.statLabel, opacity: 0.9 }}>Total Usuarios</p>
                                <p style={styles.statNumber}>{totalUsuarios}</p>
                            </div>
                            <Icons.Users />
                        </div>
                    </div>

                    <div style={{ ...styles.card, ...styles.cardBlue, color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ ...styles.statLabel, opacity: 0.9 }}>Total Roles</p>
                                <p style={styles.statNumber}>{totalRoles}</p>
                            </div>
                            <Icons.Settings />
                        </div>
                    </div>
                </div>

                {/* Tarjetas principales de Tareas */}
                <h2 style={styles.sectionTitle}>📋 Estadísticas de Tareas del MES</h2>
                <div style={{ ...styles.grid, ...styles.gridCols4 }}>
                    <div style={{ ...styles.card, ...styles.cardBlue, color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ ...styles.statLabel, opacity: 0.9 }}>Total Tareas</p>
                                <p style={styles.statNumber}>{totalTareas}</p>
                            </div>
                            <Icons.FileText />
                        </div>
                    </div>

                    <div style={{ ...styles.card, ...styles.cardGreen, color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ ...styles.statLabel, opacity: 0.9 }}>Publicadas</p>
                                <p style={styles.statNumber}>{tareasPublicadas}</p>
                            </div>
                            <Icons.CheckCircle />
                        </div>
                    </div>

                    <div style={{ ...styles.card, ...styles.cardYellow, color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ ...styles.statLabel, opacity: 0.9 }}>En Revisión</p>
                                <p style={styles.statNumber}>{tareasEnRevision}</p>
                            </div>
                            <Icons.Eye />
                        </div>
                    </div>

                    <div style={{ ...styles.card, ...styles.cardRed, color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ ...styles.statLabel, opacity: 0.9 }}>Pendientes</p>
                                <p style={styles.statNumber}>{tareasPendientes}</p>
                            </div>
                            <Icons.Clock />
                        </div>
                    </div>
                </div>

                {/* Gráficos y análisis de Tareas */}
                <div style={{ ...styles.grid, ...styles.gridCols3 }}>
                    {/* Progreso de Publicación */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Progreso de Publicación</h3>
                        <CircularProgress percentage={porcentajePublicadas} color="#10b981" />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Tareas Publicadas</p>
                            <p style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                                {tareasPublicadas} de {totalTareas} ({porcentajePublicadas}%)
                            </p>
                        </div>
                    </div>

                    {/* Análisis de Progreso */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Análisis de Progreso</h3>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Publicadas</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>{porcentajePublicadas}%</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div
                                        style={{
                                            ...styles.progressFill,
                                            width: `${porcentajePublicadas}%`,
                                            backgroundColor: '#10b981',
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>En Revisión</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>{porcentajeEnRevision}%</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div
                                        style={{
                                            ...styles.progressFill,
                                            width: `${porcentajeEnRevision}%`,
                                            backgroundColor: '#f59e0b',
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Pendientes</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>{porcentajePendientes}%</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div
                                        style={{
                                            ...styles.progressFill,
                                            width: `${porcentajePendientes}%`,
                                            backgroundColor: '#6b7280',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
