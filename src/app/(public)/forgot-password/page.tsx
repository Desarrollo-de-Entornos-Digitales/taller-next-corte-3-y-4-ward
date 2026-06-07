'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useEffect } from 'react';

import { forgotPasswordAction, resetPasswordAction } from './forgot-password.action';

type Step = 'email' | 'reset';

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
};

export default function ForgotPasswordPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState<Step>('email');
    const [resetToken, setResetToken] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(formRef.current!);
        const email = formData.get('email') as string;

        try {
            const result = await forgotPasswordAction(email);
            setResetToken(result.reset_token);
            setStep('reset');
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Error processing request'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only allow access when navigated from the login link which sets ?from=login
        if (searchParams.get('from') !== 'login') {
            router.replace('/login');
        }
    }, [searchParams, router]);

    const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(formRef.current!);
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            setError('The passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await resetPasswordAction(resetToken, newPassword);
            setSuccess('Password updated successfully');
            setTimeout(() => router.push('/login'), 2000);
        } catch (error: unknown) {
            setError(getErrorMessage(error, 'Error updating password'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/assets/bg-forgot.svg')" }}
        >
            <div className="absolute inset-0 bg-linear-to-br from-blue-900/80 via-slate-950/40 to-black/75" />
            <div className="absolute inset-0 bg-blue-950/20" />

            <div
                className="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-[36px]
                bg-white/25 backdrop-blur-4xl border border-white/20 border-t-2 border-b-2
                shadow-[0_30px_80px_rgba(15,23,42,0.22)] px-8 py-10 flex flex-col items-center gap-6"
            >
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

                {step === 'email' ? (
                    <>
                        <div className="text-center">
                            <h2 className="text-white font-semibold text-xl">Forgot your password?</h2>
                            <p className="text-white/70 text-sm mt-1">
                                Enter your email and we&apos;ll send you a reset token
                            </p>
                        </div>

                        <form
                            ref={formRef}
                            onSubmit={(e) => {
                                void handleEmailSubmit(e);
                            }}
                            className="w-full flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm text-white/90 mb-1">Email address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email address"
                                    required
                                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 transition duration-200 outline-none focus:border-sky-300 focus:ring-0"
                                />
                            </div>

                            {error && <p className="text-center text-sm text-red-400">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn border-0 rounded-full px-10 py-3 text-white bg-linear-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 font-semibold w-auto mx-auto min-w-45 disabled:opacity-60"
                            >
                                {loading ? 'Processing...' : 'Send request'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <h2 className="text-white font-semibold text-xl">Reset your password</h2>
                            <p className="text-white/70 text-sm mt-1">Enter your new password</p>
                        </div>

                        <form
                            key={step}
                            ref={formRef}
                            onSubmit={(e) => {
                                void handleResetSubmit(e);
                            }}
                            autoComplete="off"
                            className="w-full flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm text-white/90 mb-1">New password</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="New password"
                                    required
                                    defaultValue=""
                                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 transition duration-200 outline-none focus:border-sky-300 focus:ring-0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/90 mb-1">Confirm password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    required
                                    defaultValue=""
                                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 transition duration-200 outline-none focus:border-sky-300 focus:ring-0"
                                />
                            </div>

                            {error && <p className="text-center text-sm text-red-400">{error}</p>}
                            {success && <p className="text-center text-sm text-green-400">{success}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn border-0 rounded-full px-10 py-3 text-white bg-linear-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 font-semibold w-auto mx-auto min-w-45 disabled:opacity-60"
                            >
                                {loading ? 'Updating...' : 'Update password'}
                            </button>
                        </form>
                    </>
                )}

                <p className="text-sm text-white/70">
                    Remember your password?{' '}
                    <Link href="/login" className="font-bold text-white hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
