'use client';

import { useState } from 'react';

interface FavoriteButtonProps {
    isFavorited?: boolean;
    onToggle?: (isFavorited: boolean) => void;
    className?: string;
}

export default function FavoriteButton({ isFavorited = false, onToggle, className = '' }: FavoriteButtonProps) {
    const [favorited, setFavorited] = useState(isFavorited);

    const handleToggle = () => {
        const newState = !favorited;
        setFavorited(newState);
        onToggle?.(newState);
    };

    return (
        <button
            onClick={handleToggle}
            className={`relative w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 shadow-lg flex items-center justify-center ${className}`}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                className={`w-5 h-5 transition-all duration-300 ${favorited ? 'fill-white' : 'stroke-white'}`}
                viewBox="0 0 24 24"
                strokeWidth={favorited ? 0 : 1.5}
                stroke="currentColor"
                fill={favorited ? 'currentColor' : 'none'}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </button>
    );
}
