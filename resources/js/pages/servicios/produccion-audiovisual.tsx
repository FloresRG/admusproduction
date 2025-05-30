import Header from '@/components/header';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import Contactanos from '../home/contactanos';
import Footer from '../home/footer';
import Ideas from './ideas';
import NuestroTrabajo from './nuestro-trabajo';

export default function ProduccionAudiovisual() {
    const { auth } = usePage<SharedData>().props;
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.warn('Autoplay failed:', err);
            });
        }
    }, []);

    return (
        <>
            <Head title="Producción Audiovisual" />

            {/* Sección principal: video + texto, ocupa 80vh */}
            <section className="relative flex h-[80vh] w-full overflow-hidden text-white">
                <Header />
                {/* Video de fondo */}
                <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
                    <source src="/Gflores/video1.mp4" type="video/mp4" />
                    Tu navegador no soporta el video.
                </video>

                {/* Overlay oscuro mitad izquierda */}
                <div className="absolute top-0 left-0 z-10 h-full w-1/2 bg-black/70" />

                {/* Contenido */}
                <div className="relative z-20 flex h-full w-full">
                    {/* Mitad izquierda con texto */}
                    <div className="flex w-1/2 flex-col items-start justify-center p-12">
                        {/* Logo */}
                        <div
                            className="mb-8 transform transition-all duration-500 hover:scale-110"
                            style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 0, 0.7))' }}
                        >
                            <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto md:mx-0">
                                <defs>
                                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff3333" />
                                        <stop offset="100%" stopColor="#990000" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                <path d="M80 20 L150 20 L190 130 L120 130 Z" fill="url(#logoGradient)" filter="url(#glow)" />
                                <text
                                    x="150"
                                    y="120"
                                    fontFamily="Arial"
                                    fontSize="60"
                                    fontWeight="bold"
                                    fill="white"
                                    textAnchor="middle"
                                    filter="url(#glow)"
                                >
                                    ADMUS
                                </text>
                            </svg>
                        </div>

                        <h1 className="mb-4 text-5xl font-bold text-red-500 md:text-6xl" style={{ textShadow: '0 0 15px rgba(255, 0, 0, 0.4)' }}>
                            Producción Audiovisual
                        </h1>
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">Haz viral tus videos</h2>
                        <p className="mb-6 text-xl text-white/90">Producciones audiovisuales que conectan</p>

                        <a
                            href="#quienes-somos"
                            className="inline-block transform rounded-full bg-red-600 px-6 py-3 text-lg font-bold shadow-md transition hover:scale-105 hover:bg-red-500"
                        >
                            Ver Proyectos
                        </a>
                    </div>

                    {/* Mitad derecha vacía (video fondo visible) */}
                    <div className="w-1/2" />
                </div>
            </section>

            {/* Sección 2 */}
            <section className="bg-black/80 py-16 text-white">
                <p className="mx-auto max-w-3xl">
                    Queremos ayudarte a alcanzar tus objetivos y a potenciar tus ideas. Estaremos encantados de agendar una reunión contigo para hacer
                    un diagnóstico gratuito de tu presencia digital o para que nos cuentes de tu proyecto.
                </p>
            </section>
            <section id="ideas" className="bg-black/80 py-16 text-white">
                <Ideas />
            </section>

            {/* Sección 3 */}
            <section id="nuestro-trabajo" className="bg-black/80 py-16 text-white">
                <NuestroTrabajo />
            </section>

            {/* Sección 4 */}
            <section id="contactanos" className="bg-black/80 py-16 text-white">
                <Contactanos />
            </section>
            <footer className="bg-black py-8 text-white">
                <Footer />
            </footer>
        </>
    );
}
