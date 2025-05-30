import Header from '@/components/header';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Contactanos from '../home/contactanos';
import Footer from '../home/footer';
import IdeasFotografia from './ideasfoto';
import NuestroTrabajoFoto from './nuestro-trabajo-foto';

export default function Fotografia() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Producción Audiovisual" />

            {/* Sección principal: imagen + texto, ocupa 80vh */}
            <section
                className="relative flex h-[80vh] w-full overflow-hidden bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/logo.jpeg')" }} // <-- Cambia aquí el path de tu imagen
            >
                <Header />

                {/* Overlay oscuro mitad izquierda */}
                <div className="absolute top-0 left-0 z-10 h-full w-1/2 bg-black/70" />

                {/* Contenido */}
                <div className="relative z-20 flex h-full w-full">
                    {/* Mitad izquierda con texto */}
                    <div className="flex w-1/2 flex-col items-start justify-center p-12">
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
                            Fotografía Profesional
                        </h1>
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">Haz viral tus fotos</h2>
                        <p className="mb-6 text-xl text-white/90">Una imagen dice más que mil palabras</p>

                        <a
                            href="#quienes-somos"
                            className="inline-block transform rounded-full bg-red-600 px-6 py-3 text-lg font-bold shadow-md transition hover:scale-105 hover:bg-red-500"
                        >
                            Ver Proyectos
                        </a>
                    </div>

                    {/* Mitad derecha vacía (imagen fondo visible) */}
                    <div className="w-1/2" />
                </div>
            </section>

            {/* Sección 3 */}
            <section id="ideas" className="bg-black/80 py-16 text-white">
                <IdeasFotografia />
            </section>

            {/* Sección 4 */}
            <section id="nuestro-trabajo" className="bg-black/80 py-16 text-white">
                <NuestroTrabajoFoto />
            </section>

            {/* Sección 5 */}
            <section id="contactanos" className="bg-black/80 py-16 text-white">
                <Contactanos />
            </section>
            <footer className="bg-black py-8 text-white">
                <Footer />
            </footer>
        </>
    );
}
