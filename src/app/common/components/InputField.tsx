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
            <label className="block text-sm font-medium text-white/90 mb-1">{label}</label>
            {/* Input de DaisyUI con fondo blanco */}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input w-full bg-white text-gray-800 placeholder-gray-400 border-0 focus:outline-none"
            />
        </div>
    );
}
