'use client';

import Header from '@/components/header';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import ComoTrabajamos from './home/como-trabajamos';
import Contactanos from './home/contactanos';
import Footer from './home/footer';
import QuienesSomos from './home/quienes-somos';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const videoRef = useRef<HTMLVideoElement>(null);

    // Estilos personalizados directamente en el componente
    const styles = {
        videoContainer: {
            perspective: '1000px',
        },
        videoTransform: {
            transform: 'rotateY(-15deg) rotateZ(5deg)',
            transition: 'transform 500ms',
        },
        videoHover: {
            transform: 'rotateY(-15deg) rotateZ(5deg) scale(0.95)',
        },
        videoShadow: {
            boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
        },
        textShadow: {
            textShadow: '0 0 15px rgba(255, 0, 0, 0.4)',
        },
        gradientBackground: {
            background: 'linear-gradient(to bottom, #b91c1c, #000000 30%, #000000 70%, #b91c1c)',
        },
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.warn('Reproducción automática no permitida:', error);
            });
        }
    }, []);

    return (
        <>
            <Head title="AdmUs Production">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative flex min-h-screen flex-col">
                {/* Fondo con degradado */}
                <div className="fixed inset-0 z-0" style={styles.gradientBackground}></div>

                {/* Contenido */}
                <div className="relative z-20 flex flex-1 flex-col">
                    {/* Header */}
                    <Header />

                    {/* Hero Section */}
                    <section className="relative flex min-h-[90vh] flex-col items-center justify-between overflow-hidden px-4 py-16 md:flex-row md:px-12">
                        {/* Lado izquierdo - Logo y texto */}
                        <div className="z-10 mb-12 w-full md:mb-0 md:w-1/2">
                            <div className="mx-auto max-w-xl md:mx-0">
                                {/* Logo ADMUS */}
                                <div className="mb-8 transform transition-transform duration-300 hover:scale-105">
                                    <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto md:mx-0">
                                        <path d="M80 20 L150 20 L190 130 L120 130 Z" fill="red" />
                                        <text x="150" y="120" fontFamily="Arial" fontSize="60" fontWeight="bold" fill="white" textAnchor="middle">
                                            ADMUS
                                        </text>
                                    </svg>
                                </div>

                                <h1 className="mb-4 text-center text-5xl font-bold text-red-500 md:text-left md:text-6xl" style={styles.textShadow}>
                                    ADMUS Production
                                </h1>

                                <h2 className="mb-6 text-center text-3xl font-semibold text-white md:text-left md:text-4xl">Haz viral tus videos</h2>

                                <p className="mb-8 text-center text-xl text-white/90 md:text-left">
                                    Producción de audiovisuales y creación de contenido para potenciar tu alcance.
                                </p>

                                <div className="flex justify-center md:justify-start">
                                    <a
                                        href="#quienes-somos"
                                        className="inline-block transform rounded-full bg-red-600 px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        Comienza ahora
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Lado derecho - Video inclinado */}
                        <div className="relative z-10 w-full md:w-1/2">
                            <div
                                className="relative h-[400px] w-full scale-[0.9] transform transition-transform duration-500 hover:scale-[0.95] md:h-[500px]"
                                style={styles.videoContainer}
                            >
                                {/* Contenedor del video con sombra */}
                                <div
                                    className="absolute inset-0 overflow-hidden rounded-xl"
                                    style={{ ...styles.videoTransform, ...styles.videoShadow }}
                                    onMouseOver={(e) => {
                                        if (e.currentTarget) {
                                            Object.assign(e.currentTarget.style, {
                                                transform: 'rotateY(-15deg) rotateZ(5deg) scale(0.95)',
                                            });
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (e.currentTarget) {
                                            Object.assign(e.currentTarget.style, {
                                                transform: 'rotateY(-15deg) rotateZ(5deg)',
                                            });
                                        }
                                    }}
                                >
                                    {/* Video */}
                                    <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted loop playsInline>
                                        <source src="/Gflores/video1.mp4" type="video/mp4" />
                                        Tu navegador no soporta el elemento de video.
                                    </video>

                                    {/* Overlay para el texto */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                                        <div className="px-4 text-center">
                                            <h3 className="mb-2 text-3xl font-bold text-white md:text-4xl">EQUIPO</h3>
                                            <h3 className="mb-2 text-3xl font-bold text-white md:text-4xl">DE</h3>
                                            <h3 className="text-3xl font-bold text-white md:text-4xl">PRODUCCIÓN</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Resto de secciones con fondo blanco */}
                    <div className="bg-white text-gray-800">
                        <section id="quienes-somos" className="py-16">
                            <QuienesSomos />
                        </section>

                        <section id="como-trabajamos" className="py-16">
                            <ComoTrabajamos />
                        </section>

                        <section id="contactanos" className="py-16">
                            <Contactanos />
                        </section>

                        <footer className="py-8">
                            <Footer />
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
