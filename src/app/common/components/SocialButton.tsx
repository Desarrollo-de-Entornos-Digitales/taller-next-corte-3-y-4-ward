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
            // DaisyUI: btn-circle hace el botón redondo
            className="btn btn-circle bg-white/20 border-0 hover:bg-white/30 text-white"
        >
            <Icon fontSize="small" />
        </button>
    );
}
