import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#FDF5E6]"> {/* Fondo general del layout con el beige claro */}

            {/* Fondo con imagen (fondo4.png, asumiendo que es beige) */}
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/Gflores/fondo4.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.8, // Ligera opacidad para que el fondo beige de base se vea un poco y el texto resalte
                }}
            />

            {/* Logo de la aplicación con animación */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-8 relative z-20" // Ajusta el z-index para que esté por encima del fondo
            >
                <Link href="/">
                    {/* Ajusta el color del logo si es un SVG o usa un color que combine con la paleta */}
                    <AppLogoIcon className="w-24 h-24 text-[#D2B48C]" /> {/* Color de acento para el logo */}
                </Link>
            </motion.div>

            {/* Contenedor del formulario */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }} // Añade un pequeño delay para que aparezca después del logo
                className="relative z-10 w-full max-w-md bg-[#FDF5E6]/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-[#C0C0C0]/50 space-y-6" // Fondo beige semitransparente, borde suave
            >
                <div className="text-center space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-3xl font-extrabold text-[#6B5B4C] select-none" // Título en color de contraste oscuro
                    >
                        {title}
                    </motion.h1>
                    {description && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-sm text-[#A9A9A9] select-none" // Descripción en color secundario
                        >
                            {description}
                        </motion.p>
                    )}
                </div>

                {/* Contenido del formulario (se renderizará el Login.tsx aquí) */}
                <div>{children}</div>
            </motion.div>
        </div>
    );
}