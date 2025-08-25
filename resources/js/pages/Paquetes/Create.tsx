import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
interface FormData {
    nombre_paquete: string;
    caracteristicas: string;
    descripcion: string;
    monto: string;
    puntos: string;
}

interface Errors {
    [key: string]: string;
}

const Create: React.FC = () => {
    const [data, setData] = useState<FormData>({
        nombre_paquete: '',
        caracteristicas: '',
        descripcion: '',
        monto: '',
        puntos: '',
    });

    const [errors, setErrors] = useState<Errors>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/paquetes', data, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));

        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <AppLayout>
            <Head title="Crear Paquete" />

            <div
                style={{
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minHeight: '100vh',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        maxWidth: '600px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        padding: '40px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <h1
                        style={{
                            color: '#333',
                            textAlign: 'center',
                            marginBottom: '30px',
                            fontSize: '2rem',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        📦 Crear Nuevo Paquete
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '25px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    color: '#555',
                                    fontSize: '14px',
                                }}
                            >
                                🏷️ Nombre del Paquete
                            </label>
                            <input
                                type="text"
                                name="nombre_paquete"
                                value={data.nombre_paquete}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid ${errors.nombre_paquete ? '#e74c3c' : '#e1e5e9'}`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    background: '#f8f9fa',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.background = 'white';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    if (!errors.nombre_paquete) {
                                        e.target.style.borderColor = '#e1e5e9';
                                        e.target.style.background = '#f8f9fa';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            />
                            {errors.nombre_paquete && (
                                <div
                                    style={{
                                        color: '#e74c3c',
                                        fontSize: '14px',
                                        marginTop: '5px',
                                    }}
                                >
                                    {errors.nombre_paquete}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    color: '#555',
                                    fontSize: '14px',
                                }}
                            >
                                ⭐ Características
                            </label>
                            <textarea
                                name="caracteristicas"
                                value={data.caracteristicas}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid ${errors.caracteristicas ? '#e74c3c' : '#e1e5e9'}`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    background: '#f8f9fa',
                                    resize: 'vertical',
                                    minHeight: '100px',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.background = 'white';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    if (!errors.caracteristicas) {
                                        e.target.style.borderColor = '#e1e5e9';
                                        e.target.style.background = '#f8f9fa';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            />
                            {errors.caracteristicas && (
                                <div
                                    style={{
                                        color: '#e74c3c',
                                        fontSize: '14px',
                                        marginTop: '5px',
                                    }}
                                >
                                    {errors.caracteristicas}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    color: '#555',
                                    fontSize: '14px',
                                }}
                            >
                                📝 Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={data.descripcion}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid ${errors.descripcion ? '#e74c3c' : '#e1e5e9'}`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    background: '#f8f9fa',
                                    resize: 'vertical',
                                    minHeight: '100px',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.background = 'white';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    if (!errors.descripcion) {
                                        e.target.style.borderColor = '#e1e5e9';
                                        e.target.style.background = '#f8f9fa';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                            />
                            {errors.descripcion && (
                                <div
                                    style={{
                                        color: '#e74c3c',
                                        fontSize: '14px',
                                        marginTop: '5px',
                                    }}
                                >
                                    {errors.descripcion}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                marginBottom: '30px',
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: 600,
                                        color: '#555',
                                        fontSize: '14px',
                                    }}
                                >
                                    💰 Monto
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="monto"
                                    value={data.monto}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        border: `2px solid ${errors.monto ? '#e74c3c' : '#e1e5e9'}`,
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease',
                                        background: '#f8f9fa',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.background = 'white';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        if (!errors.monto) {
                                            e.target.style.borderColor = '#e1e5e9';
                                            e.target.style.background = '#f8f9fa';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                />
                                {errors.monto && (
                                    <div
                                        style={{
                                            color: '#e74c3c',
                                            fontSize: '14px',
                                            marginTop: '5px',
                                        }}
                                    >
                                        {errors.monto}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: 600,
                                        color: '#555',
                                        fontSize: '14px',
                                    }}
                                >
                                    🎯 Puntos
                                </label>
                                <input
                                    type="number"
                                    name="puntos"
                                    value={data.puntos}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        border: `2px solid ${errors.puntos ? '#e74c3c' : '#e1e5e9'}`,
                                        borderRadius: '10px',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease',
                                        background: '#f8f9fa',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.background = 'white';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        if (!errors.puntos) {
                                            e.target.style.borderColor = '#e1e5e9';
                                            e.target.style.background = '#f8f9fa';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                />
                                {errors.puntos && (
                                    <div
                                        style={{
                                            color: '#e74c3c',
                                            fontSize: '14px',
                                            marginTop: '5px',
                                        }}
                                    >
                                        {errors.puntos}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '30px',
                            }}
                        >
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    padding: '15px 30px',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    margin: '10px 5px',
                                    background: processing ? '#ccc' : 'linear-gradient(45deg, #11998e, #38ef7d)',
                                    color: 'white',
                                    opacity: processing ? 0.6 : 1,
                                }}
                                onMouseOver={(e) => {
                                    if (!processing) {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!processing) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {processing ? '⏳ Guardando...' : '💾 Guardar Paquete'}
                            </button>

                            <Link
                                href="/paquetes"
                                style={{
                                    padding: '15px 30px',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    margin: '10px 5px',
                                    background: 'linear-gradient(45deg, #757575, #616161)',
                                    color: 'white',
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
                                ↩️ Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default Create;
