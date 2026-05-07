'use client';

import { useState } from 'react';

type FilterBoxProps = {
    label: string;
    value?: string | null;
    options: string[];
    placeholder?: string;
    onChange: (value: string) => void;
};

export default function FilterBox({ label, value, options, placeholder = 'Select', onChange }: FilterBoxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedText = value || placeholder;

    return (
        <div className="relative min-w-[220px]">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                onBlur={() => setTimeout(() => setIsOpen(false), 120)}
                className="group w-full rounded-[24px] border border-white/20 bg-slate-950/70 px-5 py-4 text-left transition duration-200 hover:border-sky-400/80 hover:bg-slate-900/95 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                        <p className="mt-1 text-base font-semibold text-white">{selectedText}</p>
                    </div>
                    <div className="rounded-full bg-slate-800 p-2 text-slate-300 transition duration-200 group-hover:bg-sky-500 group-hover:text-white">
                        <span className={`inline-block transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 z-20 mt-3 rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/30 backdrop-blur-xl">
                    <div className="max-h-56 overflow-y-auto p-3">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition duration-150 ${
                                    option === value
                                        ? 'bg-sky-500/20 text-sky-200'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
