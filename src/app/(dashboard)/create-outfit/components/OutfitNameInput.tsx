'use client';

interface OutfitNameInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function OutfitNameInput({ value, onChange }: OutfitNameInputProps) {
    return (
        <div className="w-full">
            <label className="block text-lg font-bold text-white mb-4">Nombre del outfit</label>
            <input
                type="text"
                placeholder="Escribe aquí"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 text-lg"
            />
        </div>
    );
}
