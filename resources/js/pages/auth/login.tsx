'use client';

import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { FormEventHandler } from 'react';

import AuthLayout from '../../../js/layouts/auth/auth-simple-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

// Componente Input integrado con tema rojo
const Input = ({ className = '', ...props }: any) => (
    <input
        className={`flex h-12 w-full rounded-xl border-2 border-red-200 bg-white/90 px-4 py-2 text-sm backdrop-blur-sm transition-all duration-300 placeholder:text-red-300 hover:border-red-300 hover:shadow-md focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

// Componente Label integrado con tema rojo
const Label = ({ className = '', ...props }: any) => (
    <label
        className={`text-sm leading-none font-semibold tracking-wide text-red-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
        {...props}
    />
);

// Componente Button integrado con tema rojo
const Button = ({ className = '', disabled, children, ...props }: any) => (
    <button
        className={`inline-flex h-12 w-full transform items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:from-red-700 hover:to-red-800 hover:shadow-xl focus:ring-4 focus:ring-red-200 focus:outline-none active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
);

// Componente Checkbox integrado con tema rojo
const Checkbox = ({ className = '', checked, onClick, ...props }: any) => (
    <input
        type="checkbox"
        className={`h-5 w-5 cursor-pointer rounded-md border-2 border-red-300 text-red-600 transition-all duration-200 focus:ring-2 focus:ring-red-500 ${className}`}
        checked={checked}
        onChange={onClick}
        {...props}
    />
);

// Componente InputError integrado
const InputError = ({ message }: { message?: string }) => {
    return message ? (
        <div className="mt-1 flex items-center gap-2 text-sm font-medium text-red-600">
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                />
            </svg>
            {message}
        </div>
    ) : null;
};

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <style>{`
        @keyframes gentle-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        }
        .animate-gentle-spin { animation: gentle-spin 8s linear infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-shine { animation: shine 2s ease-in-out infinite; }
        .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite 1s; }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite 2s; }
        .animate-pulse-red { animation: pulse-red 2s infinite; }
      `}</style>

            <AuthLayout title="Admus Production" description="Accede a tu cuenta para continuar">
                <Head title="Iniciar Sesión" />

                <form className="space-y-8" onSubmit={submit}>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e: any) => setData('email', e.target.value)}
                                placeholder="correo@empresa.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                {canResetPassword && (
                                    <a href="#" className="text-sm font-medium text-red-600 transition-colors duration-200 hover:text-red-800">
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
                                onChange={(e: any) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="cursor-pointer font-medium text-red-700">
                                Recordar mi sesión
                            </Label>
                        </div>

                        <Button type="submit" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="mr-3 h-5 w-5 animate-spin" />}
                            {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </div>
                </form>

                {status && (
                    <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center text-sm text-emerald-600">{status}</div>
                )}
            </AuthLayout>
        </>
    );
}
