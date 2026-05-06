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
            className={`btn border-0 text-white font-semibold text-base
        bg-gradient-to-r from-blue-700 to-blue-500
        hover:from-blue-800 hover:to-blue-600
        ${fullWidth ? 'w-full' : ''}`}
        >
            {label}
        </button>
    );
}
