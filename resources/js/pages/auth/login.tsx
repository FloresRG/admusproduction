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
        <AuthLayout title="Admus Production" description="">
            <Head title="Log in" />

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
