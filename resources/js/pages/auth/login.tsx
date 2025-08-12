import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

// Definición de tipos para el formulario de login
type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

// Propiedades esperadas por el componente Login
interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    // Inicialización del formulario con Inertia.js
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    // Manejador para el envío del formulario
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                // ✅ Fuerza una recarga completa al redirigir al dashboard
                window.location.reload();
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        // El AuthLayout debe tener un fondo que complemente los colores beige.
        // Podrías establecer el fondo en AuthLayout o directamente en el body de tu CSS global.
        <AuthLayout title="Admus Production" description="">
            {/* Título de la página para SEO */}
            <Head title="Iniciar Sesión" />

            {/* Contenedor principal del formulario con animaciones de Framer Motion */}
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }} // Animación de entrada más pronunciada
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }} // Transición más suave y duradera
                className="mx-auto max-w-md rounded-xl border border-[#C0C0C0]/50 bg-[#FDF5E6] p-8 shadow-2xl backdrop-blur-sm" // Fondo beige claro, borde suave
            >
                {/* Sección del avatar central */}
                <div className="mb-6 flex justify-center">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }} // Animación al pasar el ratón más sutil
                        whileTap={{ scale: 0.95 }} // Animación al hacer click
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }} // Transición tipo muelle para el avatar
                        className="cursor-pointer"
                    ></motion.div>
                </div>

                {/* Formulario de inicio de sesión */}
                <form className="space-y-6" onSubmit={submit} noValidate>
                    <div className="space-y-5">
                        {/* Campo de correo electrónico */}
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                            <Label htmlFor="email" className="mb-1 block font-semibold text-[#6B5B4C]">
                                ingrese Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="w-full rounded-lg border border-[#C0C0C0] bg-white/70 p-3 text-[#6B5B4C] transition-colors duration-200 placeholder:text-[#A9A9A9] focus:ring-2 focus:ring-[#D2B48C] focus:outline-none" // Colores actualizados y transición
                            />
                            <InputError message={errors.email} />
                        </motion.div>

                        {/* Campo de contraseña */}
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
                            <div className="mb-1 flex items-center justify-between">
                                <Label htmlFor="password" className="font-semibold text-[#6B5B4C]">
                                    Contraseña
                                </Label>
                                {canResetPassword && (
                                    <a
                                        href={route('password.request')}
                                        className="text-sm text-[#D2B48C] transition-colors duration-200 hover:underline focus:ring-1 focus:ring-[#D2B48C] focus:outline-none" // Color de enlace actualizado
                                        tabIndex={5}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Contraseña"
                                className="w-full rounded-lg border border-[#C0C0C0] bg-white/70 p-3 text-[#6B5B4C] transition-colors duration-200 placeholder:text-[#A9A9A9] focus:ring-2 focus:ring-[#D2B48C] focus:outline-none" // Colores actualizados y transición
                            />
                            <InputError message={errors.password} />
                        </motion.div>

                        {/* Opción "Recordarme" */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex items-center space-x-3"
                        >
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="border-[#C0C0C0] text-[#D2B48C] transition-colors duration-200 focus:ring-2 focus:ring-[#D2B48C]" // Colores de checkbox actualizados
                            />
                            <Label htmlFor="remember" className="cursor-pointer text-[#6B5B4C] select-none">
                                Recordarme
                            </Label>
                        </motion.div>

                        {/* Botón de envío del formulario */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 300 }}
                        >
                            <Button
                                type="submit"
                                className="w-full rounded-lg bg-[#D2B48C] p-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-[#A9A9A9] focus:ring-2 focus:ring-[#6B5B4C] focus:outline-none" // Colores del botón actualizados
                                tabIndex={4}
                                disabled={processing}
                                aria-busy={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 inline h-5 w-5 animate-spin text-white" />}
                                Iniciar Sesión
                            </Button>
                        </motion.div>
                    </div>
                </form>

                {/* Mensaje de estado (por ejemplo, de éxito o error) */}
                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 text-center text-sm text-[#D2B48C]" // Color del mensaje de estado actualizado
                        role="alert"
                    >
                        {status}
                    </motion.div>
                )}
            </motion.div>
        </AuthLayout>
    );
}
