'use client';

import { useState, useRef, useEffect } from 'react';

interface AvatarUploaderProps {
    avatarUrl?: string | null;
    onChange?: (dataUrl: string | null) => void;
}

export default function AvatarUploader({ avatarUrl = null, onChange }: AvatarUploaderProps) {
    const [preview, setPreview] = useState<string | null>(avatarUrl);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setPreview(avatarUrl);
    }, [avatarUrl]);

    const handleFile = (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            setPreview(result);
            onChange?.(result);
            try {
                localStorage.setItem('user_avatar', result);
            } catch (e) {
                // ignore
            }
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const openFileDialog = () => inputRef.current?.click();

    const onKeyPressOpen = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFileDialog();
        }
    };

    return (
        <div>
            <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />

            <button
                type="button"
                onClick={openFileDialog}
                onKeyDown={onKeyPressOpen}
                aria-label="Cambiar foto de perfil"
                className="group relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center border border-slate-600 focus:outline-none"
            >
                {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-white/70">No image</div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">Cambiar foto</span>
                </div>
            </button>
        </div>
    );
}
