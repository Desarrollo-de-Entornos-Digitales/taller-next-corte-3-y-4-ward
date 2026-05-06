// Componente de servidor — solo muestra HTML, no necesita 'use client'.
// Props: label, placeholder, type, value, onChange
// Se usa en login, register y forgot-password sin cambiar nada.

type Props = {
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    value: string;
    onChange: (val: string) => void;
};

export default function InputField({ label, placeholder = '', type = 'text', value, onChange }: Props) {
    return (
        <div className="w-full">
            {/* Label encima del input */}
            <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm transition duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
            />
        </div>
    );
}
