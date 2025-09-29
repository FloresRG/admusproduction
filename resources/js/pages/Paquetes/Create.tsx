import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

interface FormData {
    nombre_paquete: string;
    caracteristicas: string;
    descripcion: string;
    monto: string;
    puntos: string;
    tiktok_mes: string;
    tiktok_semana: string;
    facebook_mes: string;
    facebook_semana: string;
    instagram_mes: string;
    instagram_semana: string;
    artesfacebook_mes: string;
    artesfacebook_semana: string;
    artesinstagram_mes: string;
    artesinstagram_semana: string;
    extras: string;
    total_publicaciones: string;
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
        tiktok_mes: '',
        tiktok_semana: '',
        facebook_mes: '',
        facebook_semana: '',
        instagram_mes: '',
        instagram_semana: '',
        artesfacebook_mes: '',
        artesfacebook_semana: '',
        artesinstagram_mes: '',
        artesinstagram_semana: '',
        extras: '',
        total_publicaciones: '',
    });

    const [errors, setErrors] = useState<Errors>({});
    const [processing, setProcessing] = useState(false);
    const socialOptions = [
        { key: 'tiktok', label: 'TikTok', icon: <FaTiktok /> },
        { key: 'facebook', label: 'Facebook', icon: <FaFacebook /> },
        { key: 'instagram', label: 'Instagram', icon: <FaInstagram /> },
    ];
    const [selectedSocials, setSelectedSocials] = useState<string[]>([]);

    const toggleSocial = (key: string) => {
        setSelectedSocials((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
    };

    useEffect(() => {
        // Cálculo del total de publicaciones (sin cambios)
        const total =
            (parseInt(data.tiktok_mes) || 0) +
            (parseInt(data.facebook_mes) || 0) +
            (parseInt(data.instagram_mes) || 0) +
            (parseInt(data.artesfacebook_mes) || 0) +
            (parseInt(data.artesinstagram_mes) || 0);
        setData((prev) => ({
            ...prev,
            total_publicaciones: total.toString(),
        }));
    }, [data.tiktok_mes, data.facebook_mes, data.instagram_mes, data.artesfacebook_mes, data.artesinstagram_mes]);

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

        let newValues = { [name]: value };

        // **Lógica de cálculo para campos por semana**
        if (name.endsWith('_mes')) {
            const socialKey = name.replace('_mes', ''); // 'tiktok', 'facebook', 'artesfacebook', 'instagram', 'artesinstagram'
            const semanaFieldName = `${socialKey}_semana`;

            const monthValue = parseInt(value);
            // Comprobamos si es un número válido y mayor o igual a 0
            if (!isNaN(monthValue) && monthValue >= 0) {
                // Calculamos el valor de la semana: valor_mes / 4
                // Usamos Math.floor() para asegurar un número entero, ya que es la práctica común en conteos de publicaciones
                const calculatedSemana = Math.floor(monthValue / 4);
                newValues = { ...newValues, [semanaFieldName]: calculatedSemana.toString() };
            } else if (value === '') {
                // Si el campo de mes se vacía, también vaciamos el de semana
                newValues = { ...newValues, [semanaFieldName]: '' };
            }
        }

        // Actualizar el estado 'data' con el valor de entrada y el valor calculado (si aplica)
        setData((prev) => ({ ...prev, ...newValues }));

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
                        <div style={{ marginBottom: 30, textAlign: 'center' }}>
                            <div style={{ marginBottom: 10, fontWeight: 600, color: '#555' }}>Elige redes sociales:</div>
                            {socialOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option.key}
                                    onClick={() => toggleSocial(option.key)}
                                    style={{
                                        margin: '0 10px',
                                        padding: '10px 20px',
                                        borderRadius: '30px',
                                        border: selectedSocials.includes(option.key) ? '2px solid #667eea' : '2px solid #e1e5e9',
                                        background: selectedSocials.includes(option.key) ? 'linear-gradient(45deg, #667eea, #764ba2)' : '#fff',
                                        color: selectedSocials.includes(option.key) ? '#fff' : '#555',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {option.icon} {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Campos de TikTok - MODIFICADO */}
                        {selectedSocials.includes('tiktok') && (
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '20px', // Espacio entre los dos campos
                                    marginBottom: '25px',
                                    flexWrap: 'wrap', // Permite que se envuelva en pantallas pequeñas
                                }}
                            >
                                {/* Columna "TikTok por mes" */}
                                <div style={{ flex: '1 1 45%' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                        TikTok por mes
                                    </label>
                                    <input
                                        type="number"
                                        name="tiktok_mes"
                                        value={data.tiktok_mes}
                                        onChange={handleChange}
                                        min="0"
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            border: `2px solid ${errors.tiktok_mes ? '#e74c3c' : '#e1e5e9'}`,
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            background: '#f8f9fa',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    {errors.tiktok_mes && (
                                        <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.tiktok_mes}</div>
                                    )}
                                </div>

                                {/* Columna "TikTok por semana" */}
                                <div style={{ flex: '1 1 45%' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                        TikTok por semana
                                    </label>
                                    <input
                                        type="number"
                                        name="tiktok_semana"
                                        value={data.tiktok_semana}
                                        onChange={handleChange}
                                        min="0"
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            border: `2px solid ${errors.tiktok_semana ? '#e74c3c' : '#e1e5e9'}`,
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            background: '#f8f9fa',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    {errors.tiktok_semana && (
                                        <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.tiktok_semana}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Campos de Facebook - MODIFICADO */}
                        {selectedSocials.includes('facebook') && (
                            <>
                                {/* Facebook Publicaciones */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '20px',
                                        marginBottom: '25px',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Facebook por mes
                                        </label>
                                        <input
                                            type="number"
                                            name="facebook_mes"
                                            value={data.facebook_mes}
                                            onChange={handleChange}
                                            min="0"
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.facebook_mes ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.facebook_mes && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.facebook_mes}</div>
                                        )}
                                    </div>
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Facebook por semana
                                        </label>
                                        <input
                                            type="number"
                                            name="facebook_semana"
                                            value={data.facebook_semana}
                                            onChange={handleChange}
                                            min="0"
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.facebook_semana ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.facebook_semana && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.facebook_semana}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Facebook Artes */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '20px',
                                        marginBottom: '25px',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Artes Facebook por mes
                                        </label>
                                        <input
                                            type="number"
                                            name="artesfacebook_mes"
                                            value={data.artesfacebook_mes}
                                            onChange={handleChange}
                                            min="0"
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.artesfacebook_mes ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.artesfacebook_mes && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.artesfacebook_mes}</div>
                                        )}
                                    </div>
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Artes Facebook por semana
                                        </label>
                                        <input
                                            type="number"
                                            name="artesfacebook_semana"
                                            value={data.artesfacebook_semana}
                                            onChange={handleChange}
                                            min="0"
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.artesfacebook_semana ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.artesfacebook_semana && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.artesfacebook_semana}</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Campos de Instagram - MODIFICADO */}
                        {selectedSocials.includes('instagram') && (
                            <>
                                {/* Instagram Publicaciones */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '20px',
                                        marginBottom: '25px',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Instagram por mes
                                        </label>
                                        <input
                                            type="number"
                                            name="instagram_mes"
                                            value={data.instagram_mes}
                                            onChange={handleChange}
                                            min="0"
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.instagram_mes ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.instagram_mes && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.instagram_mes}</div>
                                        )}
                                    </div>
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Instagram por semana
                                        </label>
                                        <input
                                            type="number"
                                            name="instagram_semana"
                                            value={data.instagram_semana}
                                            onChange={handleChange}
                                            min="0"
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.instagram_semana ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.instagram_semana && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.instagram_semana}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Instagram Artes */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '20px',
                                        marginBottom: '25px',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Artes Instagram por mes
                                        </label>
                                        <input
                                            type="number"
                                            name="artesinstagram_mes"
                                            value={data.artesinstagram_mes}
                                            onChange={handleChange}
                                            min="0"
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.artesinstagram_mes ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.artesinstagram_mes && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.artesinstagram_mes}</div>
                                        )}
                                    </div>
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                            Artes Instagram por semana
                                        </label>
                                        <input
                                            type="number"
                                            name="artesinstagram_semana"
                                            value={data.artesinstagram_semana}
                                            onChange={handleChange}
                                            min="0"
                                            readOnly
                                            style={{
                                                width: '100%',
                                                padding: '15px',
                                                border: `2px solid ${errors.artesinstagram_semana ? '#e74c3c' : '#e1e5e9'}`,
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                background: '#f8f9fa',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.artesinstagram_semana && (
                                            <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.artesinstagram_semana}</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>Extras</label>
                            <textarea
                                name="extras"
                                value={data.extras}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid ${errors.extras ? '#e74c3c' : '#e1e5e9'}`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    background: '#f8f9fa',
                                    resize: 'vertical',
                                    minHeight: '60px',
                                    boxSizing: 'border-box',
                                }}
                            />
                            {errors.extras && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.extras}</div>}
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#555', fontSize: '14px' }}>
                                Total de publicaciones
                            </label>
                            <input
                                type="number"
                                name="total_publicaciones"
                                value={data.total_publicaciones}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: `2px solid ${errors.total_publicaciones ? '#e74c3c' : '#e1e5e9'}`,
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    background: '#f8f9fa',
                                    boxSizing: 'border-box',
                                }}
                            />
                            {errors.total_publicaciones && (
                                <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.total_publicaciones}</div>
                            )}
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
