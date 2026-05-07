// Botón circular para login con redes sociales.
// Usa íconos de MUI (@mui/icons-material).
// Props: icon (el componente ícono de MUI), onClick

import type { SvgIconComponent } from '@mui/icons-material';

type Props = {
    // SvgIconComponent es el tipo de cualquier ícono de MUI
    Icon: SvgIconComponent;
    onClick?: () => void;
};

export default function SocialButton({ Icon, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="btn btn-circle h-12 w-12 rounded-full bg-white/10 border border-white/20 text-white transition duration-200 hover:bg-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
        >
            <Icon fontSize="small" />
        </button>
    );
}
