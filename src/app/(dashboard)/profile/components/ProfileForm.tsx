'use client';

import { useState, useEffect } from 'react';
import AvatarUploader from './AvatarUploader';

interface UserProfile {
    username: string;
    email: string;
    avatar?: string | null;
}

export default function ProfileForm() {
    const [user, setUser] = useState<UserProfile>({ username: '', email: '', avatar: null });
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // Intentar obtener el usuario real desde la API; si falla, fallback a localStorage
        let mounted = true;
        try {
            const raw = localStorage.getItem('current_user');
            if (raw) {
                const parsed = JSON.parse(raw);
                setUser({
                    username: parsed.username || 'Usuario',
                    email: parsed.email || 'usuario@example.com',
                    avatar: parsed.avatar || localStorage.getItem('user_avatar') || null,
                });
                setUsername(parsed.username || '');
            }
        } catch (e) {
            // ignore
        }

        // Then try to refresh from API
        (async () => {
            try {
                const { userService } = await import('@/src/app/common/services/user.service');
                const apiUser = await userService.getCurrentUser();
                if (!mounted) return;
                if (apiUser) {
                    const normalized = {
                        username: apiUser.username || apiUser.email || 'Usuario',
                        email: apiUser.email || 'usuario@example.com',
                        avatar: apiUser.avatar || localStorage.getItem('user_avatar') || null,
                    };
                    setUser(normalized);
                    setUsername(normalized.username);
                    try { localStorage.setItem('current_user', JSON.stringify(normalized)); } catch (e) {}
                }
            } catch (e) {
                // ignore API errors — we already showed fallback
            }
        })();

        return () => { mounted = false; };
    }, []);

    const handleSave = () => {
        setSaving(true);
        setMessage(null);
        // Simular petición: guardar en localStorage
        setTimeout(() => {
            const updated = { ...user, username, avatar: localStorage.getItem('user_avatar') || user.avatar };
            try {
                localStorage.setItem('current_user', JSON.stringify(updated));
            } catch (e) {}
            setUser(updated);
            setSaving(false);
            setMessage('Perfil guardado');
            setTimeout(() => setMessage(null), 2500);
        }, 800);
    };

    const handleAvatarChange = (dataUrl: string | null) => {
        setUser((prev) => ({ ...prev, avatar: dataUrl }));
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Perfil</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-white/80 mb-2">Foto de perfil</label>
                    <AvatarUploader avatarUrl={user.avatar} onChange={handleAvatarChange} />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/80 mb-2">Nombre de usuario</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400"
                            placeholder="Nombre de usuario"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-2">Correo</label>
                        <div className="w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-white/80">{user.email}</div>
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-2">Contraseña</label>
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-white/80">{showPassword ? 'contraseña-secreta' : '********'}</div>
                            <button onClick={() => setShowPassword((s) => !s)} className="px-3 py-2 bg-slate-700 rounded-xl text-white">
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full disabled:opacity-60"
                        >
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        {message && <span className="ml-4 text-green-300">{message}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
