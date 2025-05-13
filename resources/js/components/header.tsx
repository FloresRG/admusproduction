'use client';

import type React from 'react';

import { Link } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
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
                <Link
                    href={route('home')}
                    className="group relative text-3xl font-bold text-red-500 transition-all duration-300 hover:text-red-400"
                    style={{
                        textShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
                    }}
                >
                    AdmUs
                    <span
                        className="absolute -bottom-1 left-0 h-0.5 w-0 bg-red-500 opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100"
                        style={{
                            boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
                        }}
                    />
                </Link>

                <nav className="hidden items-center space-x-8 md:flex">
                    <NavLink href="#quienes-somos" active={isSectionActive('quienes-somos')} onClick={scrollToSection('quienes-somos')}>
                        Quiénes Somos
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

                    <button
                        onClick={toggleTheme}
                        className="transform rounded-lg bg-red-500/20 p-2 text-red-500 transition-all duration-300 hover:scale-105 hover:bg-red-500/30"
                        aria-label="Toggle theme"
                        style={{
                            boxShadow: '0 0 10px rgba(255, 0, 0, 0.2)',
                        }}
                    >
                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                    <button
                        className="ml-4 transform rounded-lg bg-red-600 p-2 text-white transition-all duration-300 hover:scale-105 hover:bg-red-700"
                        style={{
                            boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)',
                        }}
                    ></button>
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
            className={`group relative cursor-pointer py-2 text-red-500 transition-all duration-300 hover:text-red-400 ${active ? 'font-medium text-red-400' : ''} `}
            style={{
                textShadow: active ? '0 0 10px rgba(255, 0, 0, 0.4)' : '0 0 5px rgba(255, 0, 0, 0.2)',
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
