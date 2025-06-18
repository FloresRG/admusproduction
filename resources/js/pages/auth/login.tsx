import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { Avatar } from '@mui/material'; // Mantener Avatar de Material-UI
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
    status?: string; // Mensaje de estado, por ejemplo, después de un restablecimiento de contraseña
    canResetPassword: boolean; // Indica si la opción de restablecer contraseña está disponible
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
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        post(route('login'), { // Envía la solicitud POST a la ruta de login
            onFinish: () => reset('password'), // Limpia el campo de contraseña al finalizar
        });
    };

    return (
        // Layout de autenticación que envuelve el formulario
        <AuthLayout title="Admus Production" description="Gestión Integral">
            {/* Título de la página para SEO */}
            <Head title="Iniciar Sesión" />

            {/* Contenedor principal del formulario con animaciones de Framer Motion */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} // Estado inicial de la animación
                animate={{ opacity: 1, y: 0 }} // Estado final de la animación
                transition={{ duration: 0.5 }} // Duración de la transición
                className="mx-auto max-w-md rounded-xl border border-white/20 bg-white/5 p-8 shadow-2xl backdrop-blur-md"
            >
                {/* Sección del avatar central */}
                <div className="mb-6 flex justify-center">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }} // Animación al pasar el ratón
                        whileTap={{ scale: 0.95, rotate: 0 }} // Animación al hacer click
                        className="cursor-pointer"
                    >
                        <Avatar
                            alt="Avatar de Usuario"
                            src="/assets/avatar-user.png" // Ruta de la imagen del avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: '#c9ebf7', // Color de fondo del avatar
                                color: '#140f07', // Color del texto del avatar
                                fontWeight: 'bold',
                                fontSize: '2rem',
                                textTransform: 'uppercase',
                            }}
                        >
                            AD {/* Texto de fallback si la imagen no carga */}
                        </Avatar>
                    </motion.div>
                </div>

                {/* Formulario de inicio de sesión */}
                <form className="space-y-6" onSubmit={submit} noValidate>
                    <div className="space-y-5">
                        {/* Campo de correo electrónico */}
                        <div>
                            <Label htmlFor="email" className="mb-1 block font-semibold text-[#c9ebf7]">
                                Correo Electrónico
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
                                className="w-full rounded-lg border border-[#3c5db7] bg-white/10 p-3 text-white placeholder:text-[#c9ebf7] focus:ring-2 focus:ring-[#7a9efd] focus:outline-none"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Campo de contraseña */}
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <Label htmlFor="password" className="font-semibold text-[#c9ebf7]">
                                    Contraseña
                                </Label>
                                {canResetPassword && ( // Condicional para mostrar el enlace de "olvidé mi contraseña"
                                    <a
                                        href={route('password.request')}
                                        className="text-sm text-[#7a9efd] hover:underline focus:ring-1 focus:ring-[#7a9efd] focus:outline-none"
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
                                className="w-full rounded-lg border border-[#3c5db7] bg-white/10 p-3 text-white placeholder:text-[#c9ebf7] focus:ring-2 focus:ring-[#7a9efd] focus:outline-none"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Opción "Recordarme" */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="text-[#7a9efd] focus:ring-2 focus:ring-[#7a9efd]"
                            />
                            <Label htmlFor="remember" className="cursor-pointer text-[#c9ebf7] select-none">
                                Recordarme
                            </Label>
                        </div>

                        {/* Botón de envío del formulario */}
                        <Button
                            type="submit"
                            className="w-full rounded-lg bg-[#3c5db7] p-3 font-semibold text-white shadow-md transition-transform duration-300 hover:scale-[1.05] hover:bg-[#12264f] focus:ring-2 focus:ring-[#7a9efd] focus:outline-none"
                            tabIndex={4}
                            disabled={processing} // Deshabilita el botón mientras se procesa la solicitud
                            aria-busy={processing} // Indica estado de ocupado para accesibilidad
                        >
                            {processing && <LoaderCircle className="mr-2 inline h-5 w-5 animate-spin" />}
                            Iniciar Sesión
                        </Button>
                    </div>
                </form>

                {/* Mensaje de estado (por ejemplo, de éxito o error) */}
                {status && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 text-center text-sm text-green-300"
                        role="alert" // Para accesibilidad
                    >
                        {status}
                    </motion.div>
                )}
            </motion.div>
        </AuthLayout>
    );
}