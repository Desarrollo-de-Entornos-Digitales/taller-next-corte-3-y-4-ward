'use client';

import { useState, useRef, useEffect } from 'react';

interface OccasionSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const occasions = [
    'Casual',
    'Deportivo',
    'Formal',
    'Fiesta',
    'Trabajo',
    'Playa',
    'Viaje',
    'Cita',
    'Noche',
    'Reunión Familiar',
];

export default function OccasionSelector({ value, onChange }: OccasionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full">
            <label className="block text-lg font-bold text-white mb-4">Ocasión</label>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-xl transition duration-200 flex items-center justify-between border border-slate-600"
                >
                    <span>{value || 'Selecciona una ocasión'}</span>
                    <svg
                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
                        {occasions.map((occasion) => (
                            <button
                                key={occasion}
                                onClick={() => {
                                    onChange(occasion);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-6 py-3 transition duration-150 ${
                                    value === occasion
                                        ? 'bg-sky-600 text-white'
                                        : 'text-white hover:bg-slate-700'
                                }`}
                            >
                                {occasion}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
