// 'use client' porque maneja estado de los inputs con useState
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';

import InputField from '../../../common/components/InputField';
import PrimaryButton from '../../../common/components/PrimaryButton';
import SocialButton from '../../../common/components/SocialButton';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login con:', email, password);
        // Aquí iría la lógica de autenticación real
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/bg-login.jpg')" }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-950/40 to-black/75" />
            <div className="absolute inset-0 bg-blue-950/20" />

            {/* Card con fondo blanco suave y más translúcido */}
            <div
                className="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-[36px]
        bg-white/25 backdrop-blur-4xl border border-white/20 border-t-[2px] border-b-[2px] border-white/30 shadow-[0_30px_80px_rgba(15,23,42,0.22)]
        px-8 py-10 flex flex-col items-center gap-6"
            >
                <div className="absolute -top-12 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400/30 via-blue-500/20 to-indigo-500/15 blur-3xl" />

                {/* Logo / Imagen */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <Image
                        src="/ward.jpg"
                        alt="WARD"
                        width={220}
                        height={100}
                        className="h-auto w-[220px] object-contain"
                    />
                </div>

                {/* Campos del formulario — componentes reutilizables de common */}
                <div className="w-full flex flex-col gap-4">
                    <InputField
                        label="Username / Email address"
                        placeholder="Username / Email address"
                        type="email"
                        value={email}
                        onChange={setEmail}
                    />
                    <InputField
                        label="Password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                    />
                </div>

                {/* Forgot password — Link de Next.js navega sin recargar */}
                <div className="w-full text-right -mt-2">
                    <Link href="/forgot-password" className="text-sm text-white/80 hover:text-white">
                        Forgot your password?
                    </Link>
                </div>

                {/* Botón principal reutilizable */}
                <PrimaryButton label="Log in" onClick={handleLogin} fullWidth={false} />

                {/* Divisor "Or login with" */}
                <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-white/30" />
                    <span className="text-sm text-white/70">Or login with</span>
                    <div className="flex-1 h-px bg-white/30" />
                </div>

                {/* Botones sociales — componente reutilizable con ícono de MUI */}
                <div className="flex gap-4">
                    <SocialButton Icon={FacebookIcon} onClick={() => console.log('Facebook')} />
                    <SocialButton Icon={GoogleIcon} onClick={() => console.log('Google')} />
                </div>

                {/* Link a register */}
                <p className="text-sm text-white/70">
                    Don&apos;t have an Account?{' '}
                    <Link href="/register" className="font-bold text-white hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
