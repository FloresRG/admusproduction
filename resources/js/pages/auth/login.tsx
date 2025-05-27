'use client';

import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { motion } from 'framer-motion';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Avatar } from '@mui/material';
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

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto p-8 bg-white/5 backdrop-blur-md rounded-xl shadow-2xl border border-white/20"
            >
             <div className="flex justify-center mb-6">
  <motion.div
    whileHover={{ scale: 1.1, rotate: 10 }}
    whileTap={{ scale: 0.95, rotate: 0 }}
    className="cursor-pointer"
  >
    <Avatar
      alt="User Avatar"
      src="/assets/avatar-user.png" // Si tienes imagen
      sx={{
        width: 80,
        height: 80,
        bgcolor: '#c9ebf7',
        color: '#140f07',
        fontWeight: 'bold',
        fontSize: '2rem',
        textTransform: 'uppercase',
      }}
    >
      AD {/* Fallback si no hay imagen */}
    </Avatar>
  </motion.div>
</div>

                <form className="space-y-6" onSubmit={submit} noValidate>
                    <div className="space-y-5">
                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="block mb-1 font-semibold text-[#c9ebf7]">
                                Email address
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
                                placeholder="email@example.com"
                                className="p-3 w-full rounded-lg border border-[#3c5db7] bg-white/10 text-white placeholder:text-[#c9ebf7] focus:ring-2 focus:ring-[#7a9efd] focus:outline-none"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <Label htmlFor="password" className="font-semibold text-[#c9ebf7]">
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <a
                                        href={route('password.request')}
                                        className="text-sm text-[#7a9efd] hover:underline focus:outline-none focus:ring-1 focus:ring-[#7a9efd]"
                                        tabIndex={5}
                                    >
                                        Forgot password?
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
                                placeholder="Password"
                                className="p-3 w-full rounded-lg border border-[#3c5db7] bg-white/10 text-white placeholder:text-[#c9ebf7] focus:ring-2 focus:ring-[#7a9efd] focus:outline-none"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="text-[#7a9efd] focus:ring-2 focus:ring-[#7a9efd]"
                            />
                            <Label htmlFor="remember" className="text-[#c9ebf7] select-none cursor-pointer">
                                Remember me
                            </Label>
                        </div>

                        {/* Submit button */}
                        <Button
                            type="submit"
                            className="w-full p-3 bg-[#3c5db7] text-white font-semibold rounded-lg shadow-md hover:bg-[#12264f] focus:outline-none focus:ring-2 focus:ring-[#7a9efd] transition-transform duration-300 hover:scale-[1.05]"
                            tabIndex={4}
                            disabled={processing}
                            aria-busy={processing}
                        >
                            {processing && <LoaderCircle className="h-5 w-5 animate-spin inline mr-2" />}
                            Log in
                        </Button>
                    </div>
                </form>

                {/* Status message */}
                {status && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 text-center text-sm text-green-300"
                        role="alert"
                    >
                        {status}
                    </motion.div>
                )}
            </motion.div>
        </AuthLayout>
    );
}
