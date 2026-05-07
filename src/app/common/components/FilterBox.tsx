'use client';

import { useState } from 'react';

type FilterBoxProps = {
    label: string;
    value?: string | null;
    options: string[];
    placeholder?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export default function FilterBox({
    label,
    value,
    options,
    placeholder = 'Select',
    onChange,
    disabled = false,
}: FilterBoxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedText = value || placeholder;

    return (
        <div className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen((current) => !current)}
                onBlur={() => setTimeout(() => setIsOpen(false), 120)}
                className={`rounded-[20px] border px-5 py-2 text-sm font-medium flex items-center justify-between gap-3 transition duration-200 ${
                    disabled
                        ? 'border-gray-600/40 bg-slate-900/30 text-gray-600 cursor-not-allowed'
                        : 'border-gray-600/50 bg-slate-900/50 text-white hover:border-gray-500/80 hover:bg-slate-900/70'
                }`}
            >
                {selectedText}
                {!disabled && (
                    <span
                        className={`inline-block transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                        ▾
                    </span>
                )}
            </button>

            {isOpen && !disabled && (
                <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-gray-600/30 bg-slate-950/90 shadow-lg backdrop-blur-sm">
                    <div className="max-h-56 overflow-y-auto p-2">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition duration-150 ${
                                    option === value
                                        ? 'bg-blue-500/30 text-blue-200'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
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
