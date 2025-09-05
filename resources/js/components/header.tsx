'use client';

import React, { useEffect, useState } from 'react';

// Simulación de usePage para el ejemplo
const usePage = () => ({
    props: {
        auth: { user: null },
    },
});

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

    const services = [
        { title: 'Marketing Digital', description: 'Estrategias digitales...', icon: '📱', href: '/marketing' },
        // { title: 'Desarrollo Web', description: 'Sitios web modernos...', icon: '💻', href: '#desarrollo-web' },
        { title: 'Diseño Gráfico', description: 'Branding y diseño...', icon: '🎨', href: '/diseño' },
        { title: 'Producción Audiovisual', description: 'Videos profesionales...', icon: '🎬', href: '/servicios/produccion-audiovisual' },
        { title: 'Fotografía', description: 'Fotografía profesional...', icon: '📸', href: '/fotografias' },
        { title: 'Consultorías', description: 'Asesoramiento estratégico...', icon: '📊', href: '/consultorias' },
        { title: 'Eventos Digitales', description: 'Organización de eventos...', icon: '🎪', href: '/eventos-digitales' },
    ];

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!showServicesCarousel) return;
        const iv = setInterval(() => setCurrentServiceIndex((i) => (i + 1) % services.length), 4000);
        return () => clearInterval(iv);
    }, [showServicesCarousel, services.length]);

    const scrollToSection = (href: string) => (e: React.MouseEvent) => {
        if (href.startsWith('/')) return; // deja que el navegador navegue
        e.preventDefault();
        const sec = document.getElementById(href.slice(1));
        if (sec) {
            sec.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
            setShowServicesCarousel(false);
        }
    };

    const isSectionActive = (id: string) => {
        if (typeof window === 'undefined') return false;
        const sec = document.getElementById(id);
        if (!sec) return false;
        const rect = sec.getBoundingClientRect();
        const mid = (window.innerHeight || document.documentElement.clientHeight) / 2;
        return rect.top <= mid && rect.bottom >= mid;
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((o) => !o);
        setShowServicesCarousel(false);
    };
    const next = () => setCurrentServiceIndex((i) => (i + 1) % services.length);
    const prev = () => setCurrentServiceIndex((i) => (i - 1 + services.length) % services.length);
    const toggleCarousel = () => setShowServicesCarousel((s) => !s);

    if (!mounted) return null;

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${
                scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
            }`}
            style={{ boxShadow: scrolled ? '0 4px 30px rgba(255,0,0,0.15)' : 'none' }}
        >
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo */}
                <div className="flex items-center">
    <svg width="50" height="50" viewBox="0 0 50 50" className="mr-2">
        <image
            href="/Gflores/logo.png"
            x="0"
            y="0"
            width="50"
            height="50"
            preserveAspectRatio="xMidYMid meet"
        />
    </svg>
</div>


                {/* Menú Desktop */}
                <nav className="hidden items-center space-x-8 md:flex">
                    <NavLink href="#quienes-somos" active={isSectionActive('quienes-somos')} onClick={scrollToSection('#quienes-somos')}>
                        Quiénes Somos
                    </NavLink>
                    <div className="group relative">
                        <NavLink href="#servicios" active={isSectionActive('servicios')} onClick={scrollToSection('#servicios')}>
                            Servicios
                        </NavLink>
                        <div className="absolute top-full left-0 mt-1 hidden w-80 overflow-hidden rounded-lg border border-red-500/20 bg-black/90 shadow-2xl backdrop-blur-md group-hover:block">
                            <div className="py-3">
                                <div className="border-b border-red-500/20 px-4 py-2">
                                    <h3 className="text-sm font-bold text-red-400 uppercase">Nuestros Servicios</h3>
                                </div>
                                {services.map((s, i) => (
                                    <a
                                        key={i}
                                        href={s.href}
                                        onClick={scrollToSection(s.href)}
                                        className="flex items-center border-l-2 border-transparent px-4 py-3 text-white transition hover:border-red-500 hover:bg-red-600/20 hover:text-red-300"
                                    >
                                        <span className="mr-3 text-2xl">{s.icon}</span>
                                        <div>
                                            <div className="text-sm font-medium">{s.title}</div>
                                            <div className="mt-1 text-xs text-white/70">{s.description}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <NavLink
                        href="/influencersts"
                        active={false} // o mantén tu lógica si necesitas destacar esa ruta
                        onClick={scrollToSection('/influencersts')}
                    >
                        Portafolio Influencer
                    </NavLink>
                    <NavLink
                        href="/videosportafolio"
                        active={false} // o mantén tu lógica si necesitas destacar esa ruta
                        onClick={scrollToSection('//videosportafolio')}
                    >
                        Portafolio
                    </NavLink>

                    <NavLink href="#como-trabajamos" active={isSectionActive('como-trabajamos')} onClick={scrollToSection('#como-trabajamos')}>
                        Cómo Trabajamos
                    </NavLink>
                    <NavLink href="#contactanos" active={isSectionActive('contactanos')} onClick={scrollToSection('#contactanos')}>
                        Contáctanos
                    </NavLink>
                </nav>

                {/* Botón Login / Dashboard */}
                <div className="hidden items-center md:flex">
                    {auth.user ? (
                        <a
                            href={route('dashboard')}
                            className="rounded-lg bg-red-600/80 px-6 py-2.5 font-medium text-white transition hover:bg-red-500"
                        >
                            Dashboard
                        </a>
                    ) : (
                        <a href={route('login')} className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition hover:bg-red-500">
                            Login
                        </a>
                    )}
                </div>

                {/* Botón Mobile */}
                <button className="p-2 text-white md:hidden" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Menú Mobile */}
            <div
                className={`bg-black/95 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden ${
                    mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <nav className="flex flex-col space-y-4 px-4 py-4">
                    <MobileNavLink href="#quienes-somos" active={isSectionActive('quienes-somos')} onClick={scrollToSection('#quienes-somos')}>
                        Quiénes Somos
                    </MobileNavLink>
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <MobileNavLink href="#servicios" active={isSectionActive('servicios')} onClick={scrollToSection('#servicios')}>
                                Servicios
                            </MobileNavLink>
                            <button onClick={toggleCarousel} className="text-red-400 transition hover:text-red-300">
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

                        {showServicesCarousel && (
                            <div className="mt-4 overflow-hidden rounded-lg border border-red-500/20 bg-black/60">
                                <div className="relative">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${currentServiceIndex * 100}%)` }}
                                    >
                                        {services.map((s, i) => (
                                            <div key={i} className="min-w-full p-4 text-center">
                                                <div className="mb-3 text-3xl">{s.icon}</div>
                                                <h4 className="mb-2 text-lg font-bold text-red-400">{s.title}</h4>
                                                <p className="text-sm leading-relaxed text-white/80">{s.description}</p>
                                                <a
                                                    href={s.href}
                                                    onClick={scrollToSection(s.href)}
                                                    className="mt-3 inline-block text-red-300 underline transition hover:text-red-200"
                                                >
                                                    Ver más →
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={prev}
                                        className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-red-600/80 p-2 text-white transition hover:bg-red-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={next}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-red-600/80 p-2 text-white transition hover:bg-red-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex justify-center space-x-2 bg-black/40 py-3">
                                    {services.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentServiceIndex(i)}
                                            className={`h-2 w-2 rounded-full ${i === currentServiceIndex ? 'bg-red-500' : 'bg-white/30'} transition-colors`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <NavLink
                        href="/influencersts"
                        active={false} // o mantén tu lógica si necesitas destacar esa ruta
                        onClick={scrollToSection('/influencersts')}
                    >
                        Portafolio
                    </NavLink>

                    <MobileNavLink href="#como-trabajamos" active={isSectionActive('como-trabajamos')} onClick={scrollToSection('#como-trabajamos')}>
                        Cómo Trabajamos
                    </MobileNavLink>
                    <MobileNavLink href="#contactanos" active={isSectionActive('contactanos')} onClick={scrollToSection('#contactanos')}>
                        Contáctanos
                    </MobileNavLink>

                    <div className="border-t border-white/10 pt-4">
                        {auth.user ? (
                            <a
                                href={route('dashboard')}
                                className="block rounded-lg bg-red-600/80 py-3 text-center text-white transition hover:bg-red-500"
                            >
                                Dashboard
                            </a>
                        ) : (
                            <a href={route('login')} className="block rounded-lg bg-red-600 py-3 text-center text-white transition hover:bg-red-500">
                                Login
                            </a>
                        )}
                    </div>
                </nav>
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
            className={`group relative py-2 font-['Montserrat'] tracking-wide transition-all duration-300 hover:text-red-200 ${active ? 'font-medium text-red-200' : 'text-white'}`}
            style={{
                textShadow: active ? '0 0 10px rgba(255,255,255,0.4)' : '0 0 5px rgba(255,255,255,0.2)',
            }}
        >
            {children}
            <span
                className={`absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                style={{ boxShadow: '0 0 10px rgba(255,0,0,0.5)' }}
            />
        </a>
    );
}

function MobileNavLink({ href, active, onClick, children }: NavLinkProps) {
    return (
        <a
            href={href}
            onClick={onClick}
            className={`block py-2 font-['Montserrat'] text-lg tracking-wide transition-colors duration-300 ${
                active ? 'font-medium text-red-400' : 'text-white'
            } hover:text-red-300`}
            style={{
                textShadow: active ? '0 0 10px rgba(255,0,0,0.4)' : '0 0 5px rgba(255,255,255,0.2)',
            }}
        >
            {children}
        </a>
    );
}
