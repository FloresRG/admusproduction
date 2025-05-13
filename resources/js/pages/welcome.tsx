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
                {/* Video de fondo */}
                <video ref={videoRef} className="fixed inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
                    <source src="/Gflores/video1.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>

                {/* Overlay semi-transparente */}
                {/* <div className="fixed inset-0 z-10 bg-black/70"></div> */}

                {/* Contenido */}
                <div className="relative z-20 flex flex-1 flex-col">
                    {/* Header */}
                    <Header />

                    {/* Hero Section */}
                    <section className="mt-16 flex items-center justify-center py-20 md:py-12">
                        <div className="mx-auto max-w-4xl px-6 text-center">
                            <div className="rounded-xl bg-black/50 p-8 backdrop-blur-sm md:p-12">
                                <h1
                                    className="mb-4 text-6xl font-bold text-red-500 md:text-7xl"
                                    style={{ textShadow: '0 0 15px rgba(255, 0, 0, 0.4)' }}
                                >
                                    ADMUS Production
                                </h1>
                                <h2 className="mb-8 text-4xl font-semibold text-white md:text-5xl">Haz viral tus videos</h2>
                                <p className="mx-auto max-w-3xl text-xl text-white/90 md:text-2xl">
                                    Producción de audiovisuales y creación de contenido para potenciar tu alcance.
                                </p>
                                <div className="mt-10">
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
                    </section>

                    {/* Secciones adicionales */}
                    <QuienesSomos />
                    <ComoTrabajamos />
                    <Contactanos />
                    <Footer />
                </div>
            </div>
        </>
    );
}
