'use client';

import type React from 'react';

import Header from '@/components/header';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ComoTrabajamos from './home/como-trabajamos';
import Contactanos from './home/contactanos';
import Footer from './home/footer';
import QuienesSomos from './home/quienes-somos';
import NuestroTrabajo from './servicios/nuestro-trabajo';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const mainVideoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Estilos personalizados mejorados
    const styles = {
        textShadow: {
            textShadow: '0 0 15px rgba(255, 0, 0, 0.4)',
        },
        logoGlow: {
            filter: 'drop-shadow(0 0 15px rgba(255, 0, 0, 0.7))',
        },
        buttonGlow: {
            boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
        },
        // Contenedor principal con fondo negro
        mainContainer: {
            backgroundColor: '#000',
            color: '#fff',
            minHeight: '100vh',
        },
        // Estilo para el contenedor del video en diagonal - ORIENTACIÓN CORREGIDA
        videoContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '100%',
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)', // Orientación corregida
            zIndex: 1,
        },
        // Estilo para el panel de información
        infoPanel: {
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 0, 0, 0.2)',
            zIndex: 20,
        },
    };

    useEffect(() => {
        // Iniciar reproducción de videos
        const videos = [videoRef.current, mainVideoRef.current];
        videos.forEach((video) => {
            if (video) {
                video.play().catch((error) => {
                    console.warn('Reproducción automática no permitida:', error);
                });
            }
        });
    }, []);

    return (
        <>
            <Head title="AdmUs Production">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div style={styles.mainContainer as React.CSSProperties} className="relative flex min-h-screen flex-col">
                {/* Hero Section con video en diagonal */}
                <section className="relative min-h-screen overflow-hidden">
                    {/* Header */}
                    <Header />

                    {/* Video de fondo en diagonal - ORIENTACIÓN CORREGIDA */}
                    <div style={styles.videoContainer as React.CSSProperties}>
                        <video ref={mainVideoRef} autoPlay muted loop playsInline className="h-full w-full object-cover">
                            <source src="/Gflores/video1.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>

                    {/* Contenido principal */}
                    <div className="relative z-10 container mx-auto flex h-screen items-center px-4 py-16 md:py-24">
                        <div className="w-full md:w-1/2 md:pr-8">
                            {/* Logo ADMUS con animación mejorada */}
                            <div className="mb-8 transform transition-all duration-500 hover:scale-110" style={styles.logoGlow}>
                                <svg width="400" height="150" viewBox="0 0 400 150" className="drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]">
                                    <image href="/Gflores/logo1.png" x="0" y="0" width="400" height="150" preserveAspectRatio="xMidYMid slice" />
                                </svg>
                            </div>

                            <h1
                                className="mb-4 text-center text-2xl font-bold text-red-500 md:text-left md:text-3xl lg:text-5xl"
                                style={styles.textShadow}
                            >
                                Producción Audiovisual
                            </h1>

                            <h2 className="mb-6 text-center text-3xl font-semibold text-white md:text-left md:text-4xl">
                                <span className="inline-block">Haz viral tus videos</span>
                            </h2>

                            <p className="mb-8 text-center text-xl text-white/90 md:text-left">
                                Producción de audiovisuales y creación de contenido para potenciar tu alcance.
                            </p>

                            <div className="flex justify-center md:justify-start">
                                <a
                                    href="#quienes-somos"
                                    className="inline-block transform rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-red-500"
                                    style={isHovered ? styles.buttonGlow : {}}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    Comienza ahora
                                </a>
                            </div>
                        </div>

                        {/* Panel de información sobre el video */}
                        {/* <div style={styles.infoPanel as React.CSSProperties} className="hidden md:block">
                            <h3 className="mb-4 text-center text-4xl font-bold text-white" style={styles.textShadow}>
                                EQUIPO DE PRODUCCIÓN
                            </h3>
                            <p className="text-center text-xl text-white/90">
                                Creamos contenido audiovisual de alta calidad que conecta con tu audiencia y potencia tu marca.
                            </p>
                        </div> */}
                    </div>
                </section>

                {/* Resto de secciones con video de fondo */}
                <div className="relative">
                    {/* Video de fondo para todas las secciones */}
                    <div className="fixed inset-0 z-0">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover"
                            style={{ filter: 'brightness(0.15)' }}
                        >
                            <source src="/Gflores/video1.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>

                    {/* Contenido de las secciones */}
                    <div className="relative z-10">
                        <section id="quienes-somos" className="bg-black/80 py-16 text-white">
                            <QuienesSomos />
                        </section>
                        <section id="nuestro-trabajo" className="bg-black/80 py-16 text-white">
                            <NuestroTrabajo />
                        </section>

                        <section id="como-trabajamos" className="bg-black/90 py-16 text-white">
                            <ComoTrabajamos />
                        </section>

                        <section id="contactanos" className="bg-black/80 py-16 text-white">
                            <Contactanos />
                        </section>

                        <footer className="bg-black py-8 text-white">
                            <Footer />
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
