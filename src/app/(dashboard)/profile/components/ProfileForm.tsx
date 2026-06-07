'use client';

import { useState, useEffect } from 'react';
import AvatarUploader from './AvatarUploader';
import { useUserStore } from '@/src/lib/zustand/userStore';

interface UserProfile {
    username: string;
    email: string;
    avatar?: string | null;
}

export default function ProfileForm() {
    const { user, setUser } = useUserStore();
    const [userProfile, setUserProfile] = useState<UserProfile>({
        username: user?.username || 'Usuario',
        email: user?.email || 'usuario@example.com',
        avatar: user?.avatar || null,
    });
    const [username, setUsername] = useState(user?.username || '');
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const profile: UserProfile = {
                username: user.username || 'Usuario',
                email: user.email || 'usuario@example.com',
                avatar: user.avatar || null,
            };
            setUserProfile(profile);
            setUsername(profile.username);
        }
    }, [user]);

    const handleSave = () => {
        setSaving(true);
        setMessage(null);
        // Guardar en store y localStorage
        setTimeout(() => {
            const updatedProfile: UserProfile = {
                ...userProfile,
                username: username,
                avatar: userProfile.avatar,
            };
            setUserProfile(updatedProfile);
            
            // Update Zustand store
            setUser({
                id: user?.id || '1',
                username: username,
                email: userProfile.email,
                avatar: updatedProfile.avatar || undefined,
                roleId: user?.roleId || 1,
            });
            
            try {
                localStorage.setItem('current_user', JSON.stringify(updatedProfile));
            } catch (e) {}
            setSaving(false);
            setMessage('Perfil guardado');
            setTimeout(() => setMessage(null), 2500);
        }, 800);
    };

    const handleAvatarChange = (dataUrl: string | null) => {
        setUserProfile((prev) => ({ ...prev, avatar: dataUrl }));
        // Actualizar inmediatamente el store de Zustand
        setUser({
            id: user?.id || '1',
            username: user?.username || username,
            email: user?.email || 'usuario@example.com',
            avatar: dataUrl || undefined,
            roleId: user?.roleId || 1,
        });
    };

    return (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Perfil</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-white/80 mb-2">Foto de perfil</label>
                    <AvatarUploader avatarUrl={userProfile.avatar} onChange={handleAvatarChange} />
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
                        <div className="w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-white/80">{userProfile.email}</div>
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
