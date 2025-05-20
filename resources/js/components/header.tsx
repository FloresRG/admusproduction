"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

// Simulación de usePage para el ejemplo
const usePage = () => {
  return {
    props: {
      auth: {
        user: null,
      },
    },
  }
}

// Simulación de la función route
const route = (name: string) => {
  const routes: Record<string, string> = {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    home: "/",
  }
  return routes[name] || "/"
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Estado para el menú móvil
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const { auth } = usePage().props

  // Referencias para las secciones
  const quienesSomosRef = useRef<HTMLElement | null>(null)
  const comoTrabajamosRef = useRef<HTMLElement | null>(null)
  const contactanosRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    // Obtener referencias a las secciones
    quienesSomosRef.current = document.getElementById("quienes-somos")
    comoTrabajamosRef.current = document.getElementById("como-trabajamos")
    contactanosRef.current = document.getElementById("contactanos")

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
    document.documentElement.classList.toggle("dark")
  }

  // Función para desplazarse a una sección
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false) // Cerrar el menú móvil después de hacer clic
    }
  }

  // Función para determinar si una sección está activa
  const isSectionActive = (sectionId: string): boolean => {
    if (typeof window === "undefined") return false

    const section = document.getElementById(sectionId)
    if (!section) return false

    const rect = section.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight

    // Consideramos activa la sección si está visible en el viewport
    return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2
  }

  // Función para alternar el menú móvil
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  if (!mounted) return null

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      } `}
      style={{
        boxShadow: scrolled ? "0 4px 30px rgba(255, 0, 0, 0.15)" : "none",
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
          <span className="text-white font-bold text-xl font-['Bebas_Neue'] tracking-wider">ADMUS</span>
        </div>

        <nav className="hidden items-center space-x-8 md:flex">
          <NavLink
            href="#quienes-somos"
            active={isSectionActive("quienes-somos")}
            onClick={scrollToSection("quienes-somos")}
          >
            Quiénes Somos
          </NavLink>
          <div className="group relative">
            <NavLink href="#servicios" active={isSectionActive("servicios")} onClick={scrollToSection("servicios")}>
              Servicios
            </NavLink>
            <div className="absolute top-full left-0 z-50 mt-1 hidden w-64 overflow-hidden rounded-md bg-red-600 shadow-lg group-hover:block">
              <div className="py-2">
                <a href="#nuestros-servicios" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Nuestros Servicios
                </a>
                <a href="#marketing-digital" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Marketing Digital
                </a>
                <a href="#desarrollo-web" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Desarrollo Web
                </a>
                <a href="#diseno-grafico" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Diseño Gráfico y Branding
                </a>
                <a href="#consultorias" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Consultorías
                </a>
                <a href="#produccion-audiovisual" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Producción Audiovisual
                </a>
                <a href="#fotografia" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Fotografía
                </a>
                <a href="#eventos-digitales" className="block px-4 py-3 text-white hover:bg-red-700 font-['Montserrat']">
                  Eventos Digitales y en Vivo
                </a>
              </div>
            </div>
          </div>
          <NavLink href="#portafolio" active={isSectionActive("portafolio")} onClick={scrollToSection("portafolio")}>
            Portafolio
          </NavLink>
          <NavLink
            href="#como-trabajamos"
            active={isSectionActive("como-trabajamos")}
            onClick={scrollToSection("como-trabajamos")}
          >
            Cómo Trabajamos
          </NavLink>
          <NavLink href="#contactanos" active={isSectionActive("contactanos")} onClick={scrollToSection("contactanos")}>
            Contáctanos
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center">
          {auth.user ? (
            <a
              href={route("dashboard")}
              className="group relative mr-4 inline-block overflow-hidden rounded-sm border border-red-500/30 px-5 py-1.5 text-sm leading-normal text-red-500 transition-all duration-300 hover:border-red-500/70 hover:text-red-400 font-['Montserrat']"
              style={{
                textShadow: "0 0 5px rgba(255, 0, 0, 0.2)",
              }}
            >
              <span className="relative z-10">Dashboard</span>
              <span className="absolute inset-0 origin-left scale-x-0 transform bg-red-500/10 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ) : (
            <>
              <a
                href={route("login")}
                className="group relative mr-2 inline-block overflow-hidden rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-red-500 transition-all duration-300 hover:border-red-500/30 hover:text-red-400 font-['Montserrat']"
                style={{
                  textShadow: "0 0 5px rgba(255, 0, 0, 0.2)",
                }}
              >
                <span className="relative z-10">Log in</span>
                <span className="absolute inset-0 origin-left scale-x-0 transform bg-red-500/10 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
              <a
                href={route("register")}
                className="group relative mr-4 inline-block overflow-hidden rounded-sm border border-red-500/30 px-5 py-1.5 text-sm leading-normal text-red-500 transition-all duration-300 hover:border-red-500/70 hover:text-red-400 font-['Montserrat']"
                style={{
                  textShadow: "0 0 5px rgba(255, 0, 0, 0.2)",
                }}
              >
                <span className="relative z-10">Register</span>
                <span className="absolute inset-0 origin-left scale-x-0 transform bg-red-500/10 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
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
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-black/90 backdrop-blur-md px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <MobileNavLink
              href="#quienes-somos"
              active={isSectionActive("quienes-somos")}
              onClick={scrollToSection("quienes-somos")}
            >
              Quiénes Somos
            </MobileNavLink>
            <div className="relative">
              <MobileNavLink
                href="#servicios"
                active={isSectionActive("servicios")}
                onClick={scrollToSection("servicios")}
              >
                Servicios
              </MobileNavLink>
              <div className="pl-4 mt-2 space-y-2 border-l-2 border-red-500/30">
                <a
                  href="#nuestros-servicios"
                  className="block py-2 text-white/80 hover:text-red-400 font-['Montserrat']"
                  onClick={scrollToSection("nuestros-servicios")}
                >
                  Nuestros Servicios
                </a>
                <a
                  href="#marketing-digital"
                  className="block py-2 text-white/80 hover:text-red-400 font-['Montserrat']"
                  onClick={scrollToSection("marketing-digital")}
                >
                  Marketing Digital
                </a>
                <a
                  href="#desarrollo-web"
                  className="block py-2 text-white/80 hover:text-red-400 font-['Montserrat']"
                  onClick={scrollToSection("desarrollo-web")}
                >
                  Desarrollo Web
                </a>
                <a
                  href="#produccion-audiovisual"
                  className="block py-2 text-white/80 hover:text-red-400 font-['Montserrat']"
                  onClick={scrollToSection("produccion-audiovisual")}
                >
                  Producción Audiovisual
                </a>
              </div>
            </div>
            <MobileNavLink
              href="#portafolio"
              active={isSectionActive("portafolio")}
              onClick={scrollToSection("portafolio")}
            >
              Portafolio
            </MobileNavLink>
            <MobileNavLink
              href="#como-trabajamos"
              active={isSectionActive("como-trabajamos")}
              onClick={scrollToSection("como-trabajamos")}
            >
              Cómo Trabajamos
            </MobileNavLink>
            <MobileNavLink
              href="#contactanos"
              active={isSectionActive("contactanos")}
              onClick={scrollToSection("contactanos")}
            >
              Contáctanos
            </MobileNavLink>

            {/* Botones de autenticación para móvil */}
            <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
              {auth.user ? (
                <a
                  href={route("dashboard")}
                  className="bg-red-600/80 text-white px-4 py-3 rounded-md text-center hover:bg-red-500 transition-colors duration-300 font-['Montserrat']"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    href={route("login")}
                    className="bg-transparent border border-red-500/30 text-red-500 px-4 py-3 rounded-md text-center hover:bg-red-500/10 transition-colors duration-300 font-['Montserrat']"
                  >
                    Log in
                  </a>
                  <a
                    href={route("register")}
                    className="bg-red-600/80 text-white px-4 py-3 rounded-md text-center hover:bg-red-500 transition-colors duration-300 font-['Montserrat']"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

interface NavLinkProps {
  href: string
  active: boolean
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
}

function NavLink({ href, active, onClick, children }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative cursor-pointer py-2 text-white transition-all duration-300 hover:text-red-200 ${
        active ? "font-medium text-red-200" : ""
      } font-['Montserrat'] tracking-wide`}
      style={{
        textShadow: active ? "0 0 10px rgba(255, 255, 255, 0.4)" : "0 0 5px rgba(255, 255, 255, 0.2)",
        fontWeight: 500,
        letterSpacing: "0.5px",
      }}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        } `}
        style={{
          boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
        }}
      />
    </a>
  )
}

// Componente para enlaces en el menú móvil
function MobileNavLink({ href, active, onClick, children }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`block py-2 text-lg transition-colors duration-300 ${
        active ? "text-red-400 font-medium" : "text-white"
      } hover:text-red-300 font-['Montserrat'] tracking-wide`}
      style={{
        textShadow: active ? "0 0 10px rgba(255, 0, 0, 0.4)" : "0 0 5px rgba(255, 255, 255, 0.2)",
      }}
    >
      {children}
    </a>
  )
}
