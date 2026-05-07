// Botón principal reutilizable.
// Props: label, onClick, fullWidth (opcional)
// DaisyUI: btn — personalizado con gradiente azul igual al mockup.

type Props = {
    label: string;
    onClick?: () => void;
    fullWidth?: boolean;
    type?: 'button' | 'submit';
};

export default function PrimaryButton({ label, onClick, fullWidth = true, type = 'button' }: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn border-0 rounded-2xl px-10 py-3 text-white font-semibold text-base
        bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700
        shadow-lg shadow-sky-500/25 transition duration-200 ease-out
        hover:from-sky-400 hover:via-blue-500 hover:to-indigo-600
        ${fullWidth ? 'w-full' : 'w-auto'} ${fullWidth ? '' : 'min-w-[220px]'}`}
        >
            {label}
        </button>
    );
}
