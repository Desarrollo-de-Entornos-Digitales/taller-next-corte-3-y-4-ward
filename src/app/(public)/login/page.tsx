'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';

import SocialButton from '../../common/components/SocialButton';

import loginAction from './login.action';

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;
    return fallback;
};

export default function LoginPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(null);

        const formData = new FormData(formRef.current!);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await loginAction(email, password);
            localStorage.setItem('token', result.access_token);
            router.push('/feed');
        } catch (error: unknown) {
            console.error('Login error:', error);
            setLoginError(getErrorMessage(error, 'Error al iniciar sesión'));
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/bg-login.jpg')" }}
        >
            <div className="absolute inset-0 bg-linear-to-br from-blue-900/80 via-slate-950/40 to-black/75" />
            <div className="absolute inset-0 bg-blue-950/20" />

            <div
                className="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-[36px]
                bg-white/25 backdrop-blur-4xl border border-white/20 border-t-2 border-b-2
                shadow-[0_30px_80px_rgba(15,23,42,0.22)] px-8 py-10 flex flex-col items-center gap-6"
            >
                <div
                    className="absolute -top-12 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full
                    bg-linear-to-r from-sky-400/30 via-blue-500/20 to-indigo-500/15 blur-3xl"
                />

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <Image
                        src="/ward.svg"
                        alt="WARD"
                        width={220}
                        height={100}
                        loading="eager"
                        style={{ width: 220, height: 'auto' }}
                        className="object-contain"
                    />
                </div>

                <form
                    ref={formRef}
                    onSubmit={(e) => {
                        void handleSubmit(e);
                    }}
                    className="w-full flex flex-col gap-4"
                >
                    <div>
                        <label className="block text-sm text-white/90 mb-1">Username / Email address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Username / Email address"
                            required
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 transition duration-200 outline-none focus:border-sky-300 focus:ring-0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/90 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 transition duration-200 outline-none focus:border-sky-300 focus:ring-0"
                        />
                    </div>

                    <div className="w-full text-right">
                        <Link href="/forgot-password?from=login" className="text-sm text-white/80 hover:text-white">
                            Forgot your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn border-0 rounded-full px-10 py-3 text-white bg-linear-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 font-semibold w-auto mx-auto min-w-45"
                    >
                        Log in
                    </button>
                    {loginError && <p className="text-center text-sm text-red-400 mt-2">{loginError}</p>}
                </form>

                <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-white/30" />
                    <span className="text-sm text-white/70">Or login with</span>
                    <div className="flex-1 h-px bg-white/30" />
                </div>

                <div className="flex gap-4">
                    <SocialButton Icon={FacebookIcon} onClick={() => console.warn('Facebook login coming soon')} />
                    <SocialButton Icon={GoogleIcon} onClick={() => console.warn('Google login coming soon')} />
                </div>

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
