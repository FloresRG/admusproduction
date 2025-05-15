import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-r from-black via-red-500 to-black relative">
            {/* Contenedor de la imagen a la izquierda con opacidad */}
            <div className="absolute left-0 top-0 w-1/2 h-full">
                <img
                    src="logo.jpeg" // Cambia esto por el path correcto de tu imagen
                    alt="Background"
                    className="w-full h-full object-cover opacity-40" // Ajusta la opacidad según necesites
                />
            </div>

            {/* Contenedor del formulario alineado a la derecha, ligeramente centrado */}
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200 space-y-6 ml-auto mr-20 z-10">
                <div className="flex flex-col items-center gap-4">
                    <Link href={route('home')} className="flex flex-col items-center gap-2">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-black via-red-500 to-black">
                            <AppLogoIcon className="h-8 w-8 fill-current text-white" />
                        </div>
                        <span className="sr-only">{title}</span>
                    </Link>

                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-red-900">{title}</h1>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
