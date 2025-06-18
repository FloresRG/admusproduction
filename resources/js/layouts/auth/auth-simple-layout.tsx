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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Fondo con GIF animado */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/Gflores/6.gif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(2px)',
        }}
      />

    

      {/* Contenedor del formulario */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20 space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-[#3c5db7] select-none">{title}</h1>
          {description && <p className="text-sm text-[#c9ebf7] select-none">{description}</p>}
        </div>

        {/* Contenido del formulario */}
        <div>{children}</div>
      </motion.div>
    </div>
  );
}
