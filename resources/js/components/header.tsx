'use client';

import type React from 'react';

import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// Simulación de usePage para el ejemplo
const usePage = () => {
    return {
        props: {
            auth: {
                user: null,
            },
        },
    };
};

// Simulación de la función route
const route = (name: string) => {
    const routes: Record<string, string> = {
        login: '/login',
        register: '/register',
        dashboard: '/dashboard',
        home: '/',
    };
    return routes[name] || '/';
};

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const { auth } = usePage().props;

    // Referencias para las secciones
    const quienesSomosRef = useRef<HTMLElement | null>(null);
    const comoTrabajamosRef = useRef<HTMLElement | null>(null);
    const contactanosRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        // Obtener referencias a las secciones
        quienesSomosRef.current = document.getElementById('quienes-somos');
        comoTrabajamosRef.current = document.getElementById('como-trabajamos');
        contactanosRef.current = document.getElementById('contactanos');

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    // Función para desplazarse a una sección
    const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Función para determinar si una sección está activa
    const isSectionActive = (sectionId: string): boolean => {
        if (typeof window === 'undefined') return false;

        const section = document.getElementById(sectionId);
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // Consideramos activa la sección si está visible en el viewport
        return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
    };

    if (!mounted) return null;

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'} `}
            style={{
                boxShadow: scrolled ? '0 4px 30px rgba(255, 0, 0, 0.15)' : 'none',
            }}
        >
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <div className="w-20"></div>

                <nav className="hidden items-center space-x-8 md:flex">
                    <NavLink href="#quienes-somos" active={isSectionActive('quienes-somos')} onClick={scrollToSection('quienes-somos')}>
                        Quiénes Somos
                    </NavLink>
                    <div className="group relative">
                        <NavLink href="#servicios" active={isSectionActive('servicios')} onClick={scrollToSection('servicios')}>
                            Servicios
                        </NavLink>
                        <div className="absolute top-full left-0 z-50 mt-1 hidden w-64 overflow-hidden rounded-md bg-red-600 shadow-lg group-hover:block">
                            <div className="py-2">
                                <a href="#nuestros-servicios" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Nuestros Servicios
                                </a>
                                <a href="#marketing-digital" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Marketing Digital
                                </a>
                                <a href="#desarrollo-web" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Desarrollo Web
                                </a>
                                <a href="#diseno-grafico" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Diseño Gráfico y Branding
                                </a>
                                <a href="#consultorias" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Consultorías
                                </a>
                                <a href="#produccion-audiovisual" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Producción Audiovisual
                                </a>
                                <a href="#fotografia" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Fotografía
                                </a>
                                <a href="#eventos-digitales" className="block px-4 py-3 text-white hover:bg-red-700">
                                    Eventos Digitales y en Vivo
                                </a>
                            </div>
                        </div>
                    </div>
                    <NavLink href="#portafolio" active={isSectionActive('portafolio')} onClick={scrollToSection('portafolio')}>
                        Portafolio
                    </NavLink>
                    <NavLink href="#como-trabajamos" active={isSectionActive('como-trabajamos')} onClick={scrollToSection('como-trabajamos')}>
                        Cómo Trabajamos
                    </NavLink>
                    <NavLink href="#contactanos" active={isSectionActive('contactanos')} onClick={scrollToSection('contactanos')}>
                        Contáctanos
                    </NavLink>
                </nav>

                <div className="flex items-center">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="group relative mr-4 inline-block overflow-hidden rounded-sm border border-red-500/30 px-5 py-1.5 text-sm leading-normal text-red-500 transition-all duration-300 hover:border-red-500/70 hover:text-red-400"
                            style={{
                                textShadow: '0 0 5px rgba(255, 0, 0, 0.2)',
                            }}
                        >
                            <span className="relative z-10">Dashboard</span>
                            <span className="absolute inset-0 origin-left scale-x-0 transform bg-red-500/10 transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="group relative mr-2 inline-block overflow-hidden rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-red-500 transition-all duration-300 hover:border-red-500/30 hover:text-red-400"
                                style={{
                                    textShadow: '0 0 5px rgba(255, 0, 0, 0.2)',
                                }}
                            >
                                <span className="relative z-10">Log in</span>
                                <span className="absolute inset-0 origin-left scale-x-0 transform bg-red-500/10 transition-transform duration-300 group-hover:scale-x-100" />
                            </Link>
                            <Link
                                href={route('register')}
                                className="group relative mr-4 inline-block overflow-hidden rounded-sm border border-red-500/30 px-5 py-1.5 text-sm leading-normal text-red-500 transition-all duration-300 hover:border-red-500/70 hover:text-red-400"
                                style={{
                                    textShadow: '0 0 5px rgba(255, 0, 0, 0.2)',
                                }}
                            >
                                <span className="relative z-10">Register</span>
                                <span className="absolute inset-0 origin-left scale-x-0 transform bg-red-500/10 transition-transform duration-300 group-hover:scale-x-100" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

interface NavLinkProps {
    href: string;
    active: boolean;
    onClick: (e: React.MouseEvent) => void;
    children: React.ReactNode;
}

function NavLink({ href, active, onClick, children }: NavLinkProps) {
    return (
        <a
            href={href}
            onClick={onClick}
            className={`group relative cursor-pointer py-2 text-white transition-all duration-300 hover:text-red-200 ${active ? 'font-medium text-red-200' : ''} `}
            style={{
                textShadow: active ? '0 0 10px rgba(255, 255, 255, 0.4)' : '0 0 5px rgba(255, 255, 255, 0.2)',
                fontFamily: "'Georgia', serif",
                fontWeight: 500,
                letterSpacing: '0.5px',
            }}
        >
            {children}
            <span
                className={`absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'} `}
                style={{
                    boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
                }}
            />
        </a>
    );
}
