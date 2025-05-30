'use client';

import type React from 'react';
import { Link } from '@inertiajs/react';

import { useEffect, useState } from 'react';

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
        dashboard: '/dashboard',
        home: '/',
    };
    return routes[name] || '/';
};

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [showServicesCarousel, setShowServicesCarousel] = useState(false);
    const { auth } = usePage().props;

    // Lista de servicios
    const services = [
        {
            title: 'Marketing Digital',
            description: 'Estrategias digitales para aumentar tu presencia online',
            icon: '📱',
            href: '/marketing',
        },
        {
            title: 'Desarrollo Web',
            description: 'Sitios web modernos y aplicaciones personalizadas',
            icon: '💻',
            href: '#desarrollo-web',
        },
        {
            title: 'Diseño Gráfico',
            description: 'Branding y diseño visual para tu marca',
            icon: '🎨',
            href: '#diseno-grafico',
        },
        {
            title: 'Producción Audiovisual',
            description: 'Videos profesionales y contenido multimedia',
            icon: '🎬',
            href: '#produccion-audiovisual',
        },
        {
            title: 'Fotografía',
            description: 'Fotografía profesional para eventos y productos',
            icon: '📸',
            href: '#fotografia',
        },
        {
            title: 'Consultorías',
            description: 'Asesoramiento estratégico para tu negocio',
            icon: '📊',
            href: '#consultorias',
        },
        {
            title: 'Eventos Digitales',
            description: 'Organización de eventos virtuales y presenciales',
            icon: '🎪',
            href: '#eventos-digitales',
        },
    ];

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-scroll para el carrusel de servicios en móvil
    useEffect(() => {
        if (showServicesCarousel) {
            const interval = setInterval(() => {
                setCurrentServiceIndex((prev) => (prev + 1) % services.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [showServicesCarousel, services.length]);

    // Función para desplazarse a una sección
    const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
            setShowServicesCarousel(false);
        }
    };

    // Función para determinar si una sección está activa
    const isSectionActive = (sectionId: string): boolean => {
        if (typeof window === 'undefined') return false;

        const section = document.getElementById(sectionId);
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
    };

    // Función para alternar el menú móvil
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        setShowServicesCarousel(false);
    };

    // Funciones para el carrusel de servicios
    const nextService = () => {
        setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    };

    const prevService = () => {
        setCurrentServiceIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    const toggleServicesCarousel = () => {
        setShowServicesCarousel(!showServicesCarousel);
    };

    if (!mounted) return null;

    return (
         <header
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${
                scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'
            } `}
            style={{
                boxShadow: scrolled ? '0 4px 30px rgba(255, 0, 0, 0.15)' : 'none',
            }}
        >
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <div className="flex items-center">
                    <svg width="50" height="50" viewBox="0 0 300 150" className="mr-2">
                        <path d="M80 20 L150 20 L190 130 L120 130 Z" fill="#ff0000" />
                        <text x="150" y="120" fontFamily="'Bebas Neue', sans-serif" fontSize="60" fontWeight="bold" fill="white" textAnchor="middle">
                            ADMUS
                        </text>
                    </svg>
                    <span className="font-['Bebas_Neue'] text-xl font-bold tracking-wider text-white">ADMUS</span>
                </div>

                <nav className="hidden items-center space-x-8 md:flex">
                    <NavLink href="#quienes-somos" active={isSectionActive('quienes-somos')} onClick={scrollToSection('quienes-somos')}>
                        Quiénes Somos
                    </NavLink>
                    <div className="group relative">
                        <NavLink href="#servicios" active={isSectionActive('servicios')} onClick={scrollToSection('servicios')}>
                            Servicios
                        </NavLink>
                        <div className="absolute top-full left-0 z-50 mt-1 hidden w-80 overflow-hidden rounded-lg border border-red-500/20 bg-black/90 shadow-2xl backdrop-blur-md group-hover:block">
                            <div className="py-3">
                                <div className="border-b border-red-500/20 px-4 py-2">
                                    <h3 className="text-sm font-bold tracking-wider text-red-400 uppercase">Nuestros Servicios</h3>
                                </div>
                                {services.map((service, index) => (
                                    <Link
                                        key={index}
                                        href={service.href}
                                        className="flex items-center border-l-2 border-transparent px-4 py-3 text-white transition-all duration-300 hover:border-red-500 hover:bg-red-600/20 hover:text-red-300"
                                    >
                                        <span className="mr-3 text-2xl">{service.icon}</span>
                                        <div>
                                            <div className="text-sm font-medium">{service.title}</div>
                                            <div className="mt-1 text-xs text-white/70">{service.description}</div>
                                        </div>
                                    </Link>
                                ))}
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

                <div className="hidden items-center md:flex">
                    {auth.user ? (
                        <a
                            href={route('dashboard')}
                            className="group relative inline-block overflow-hidden rounded-lg bg-red-600/80 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25"
                        >
                            <span className="relative z-10">Dashboard</span>
                        </a>
                    ) : (
                        <a
                            href={route('login')}
                            className="group relative inline-block overflow-hidden rounded-lg bg-red-600 px-6 py-2.5 font-['Montserrat'] text-sm font-medium text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25"
                        >
                            <span className="relative z-10">Login</span>
                        </a>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="p-2 text-white md:hidden" onClick={toggleMobileMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
                    mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="bg-black/95 px-4 py-4 backdrop-blur-md">
                    <nav className="flex flex-col space-y-4">
                        <MobileNavLink href="#quienes-somos" active={isSectionActive('quienes-somos')} onClick={scrollToSection('quienes-somos')}>
                            Quiénes Somos
                        </MobileNavLink>

                        {/* Servicios con carrusel para móvil */}
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <MobileNavLink href="#servicios" active={isSectionActive('servicios')} onClick={scrollToSection('servicios')}>
                                    Servicios
                                </MobileNavLink>
                                <button onClick={toggleServicesCarousel} className="text-red-400 transition-colors hover:text-red-300">
                                    <svg
                                        className={`h-5 w-5 transform transition-transform ${showServicesCarousel ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Carrusel de servicios para móvil */}
                            {showServicesCarousel && (
                                <div className="mt-4 overflow-hidden rounded-lg border border-red-500/20 bg-black/60">
                                    <div className="relative">
                                        <div
                                            className="flex transition-transform duration-500 ease-in-out"
                                            style={{ transform: `translateX(-${currentServiceIndex * 100}%)` }}
                                        >
                                            {services.map((service, index) => (
                                                <div key={index} className="min-w-full p-4">
                                                    <div className="text-center">
                                                        <div className="mb-3 text-3xl">{service.icon}</div>
                                                        <h4 className="mb-2 text-lg font-bold text-red-400">{service.title}</h4>
                                                        <p className="text-sm leading-relaxed text-white/80">{service.description}</p>
                                                        <button
                                                            onClick={scrollToSection(service.href.substring(1))}
                                                            className="mt-3 text-sm font-medium text-red-300 underline underline-offset-2 hover:text-red-200"
                                                        >
                                                            Ver más →
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Controles del carrusel */}
                                        <button
                                            onClick={prevService}
                                            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-red-600/80 p-2 text-white transition-colors hover:bg-red-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={nextService}
                                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-red-600/80 p-2 text-white transition-colors hover:bg-red-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Indicadores */}
                                    <div className="flex justify-center space-x-2 bg-black/40 py-3">
                                        {services.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentServiceIndex(index)}
                                                className={`h-2 w-2 rounded-full transition-colors ${
                                                    index === currentServiceIndex ? 'bg-red-500' : 'bg-white/30'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <MobileNavLink href="#portafolio" active={isSectionActive('portafolio')} onClick={scrollToSection('portafolio')}>
                            Portafolio
                        </MobileNavLink>
                        <MobileNavLink
                            href="#como-trabajamos"
                            active={isSectionActive('como-trabajamos')}
                            onClick={scrollToSection('como-trabajamos')}
                        >
                            Cómo Trabajamos
                        </MobileNavLink>
                        <MobileNavLink href="#contactanos" active={isSectionActive('contactanos')} onClick={scrollToSection('contactanos')}>
                            Contáctanos
                        </MobileNavLink>

                        {/* Botón de Login para móvil */}
                        <div className="border-t border-white/10 pt-4">
                            {auth.user ? (
                                <a
                                    href={route('dashboard')}
                                    className="block rounded-lg bg-red-600/80 px-4 py-3 text-center font-medium text-white transition-colors duration-300 hover:bg-red-500"
                                >
                                    Dashboard
                                </a>
                            ) : (
                                <a
                                    href={route('login')}
                                    className="block rounded-lg bg-red-600 px-4 py-3 text-center font-medium text-white shadow-lg transition-colors duration-300 hover:bg-red-500"
                                >
                                    Login
                                </a>
                            )}
                        </div>
                    </nav>
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

function NavLink({ href, active, children }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={`group relative cursor-pointer py-2 text-white transition-all duration-300 hover:text-red-200 ${
                active ? 'font-medium text-red-200' : ''
            } font-['Montserrat'] tracking-wide`}
            style={{
                textShadow: active ? '0 0 10px rgba(255, 255, 255, 0.4)' : '0 0 5px rgba(255, 255, 255, 0.2)',
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
        </Link>
    );
}

// Componente para enlaces en el menú móvil
function MobileNavLink({ href, active, onClick, children }: NavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block py-2 text-lg transition-colors duration-300 ${
                active ? 'font-medium text-red-400' : 'text-white'
            } font-['Montserrat'] tracking-wide hover:text-red-300`}
            style={{
                textShadow: active ? '0 0 10px rgba(255, 0, 0, 0.4)' : '0 0 5px rgba(255, 255, 255, 0.2)',
            }}
        >
            {children}
        </Link>
    );
}
