'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoutAction from '../../logout.action';
import { useUserStore } from '@/src/lib/zustand/userStore';

export default function NavBar() {
    const router = useRouter();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const { user } = useUserStore();

    useEffect(() => {
        try {
            const stored = localStorage.getItem('user_avatar');
            if (stored) setAvatarUrl(stored);
        } catch (e) {
            setAvatarUrl(null);
        }

        const onStorage = (ev: StorageEvent) => {
            if (ev.key === 'user_avatar') {
                setAvatarUrl(ev.newValue);
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const navLinks = [
        { label: 'Mis Prendas', href: '/my-garments' },
        { label: 'Registrar Prenda', href: '/register-garment' },
        { label: 'Crear Outfit', href: '/create-outfit' },
        { label: 'Mis Outifts', href: '/my-outfits' },
    ];

    const handleLogout = async () => {
        localStorage.removeItem('token');
        await logoutAction();
        router.push('/login');
    };

    return (
        <div className="sticky top-6 z-50 w-[90%] max-w-4xl mx-auto">
            <div className="navbar bg-slate-900/40 backdrop-blur-md rounded-full px-6 shadow-lg border border-white/10">
                {/* Logo */}
                <div className="navbar-start">
                    <button onClick={() => router.push('/feed')} className="btn btn-ghost hover:bg-transparent px-0">
                        <Image
                            src="/assets/ward-logo.svg"
                            alt="WARD logo"
                            width={80}
                            height={32}
                            loading="eager"
                            className="object-contain"
                        />
                    </button>
                </div>

                {/* Nav links - desktop */}
                <div className="navbar-center hidden md:flex gap-2">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={() => router.push(link.href)}
                            className="btn btn-ghost btn-sm text-white/80 hover:text-white hover:bg-white/10 rounded-full text-sm font-medium transition-all"
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Avatar + mobile menu */}
                <div className="navbar-end flex items-center gap-2">
                    {/* Mobile dropdown */}
                    <div className="dropdown dropdown-end md:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-300 rounded-box w-52"
                        >
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <button
                                        onClick={() => router.push(link.href)}
                                        className="text-white hover:text-slate-200"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Avatar dropdown */}
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-blue-400 transition-all"
                        >
                            <div className="w-10 rounded-full overflow-hidden ring-2 ring-white/20 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                                {user?.avatar || avatarUrl ? (
                                    <img
                                        src={user?.avatar || avatarUrl || ''}
                                        alt="User avatar"
                                        width={40}
                                        height={40}
                                        className="object-cover w-10 h-10"
                                    />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 text-white"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-300 rounded-box w-52"
                        >
                            <li>
                                <button onClick={() => router.push('/profile')} className="text- hover:text-slate-200">
                                    Mi Perfil
                                </button>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
