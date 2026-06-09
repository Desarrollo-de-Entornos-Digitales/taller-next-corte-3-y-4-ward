'use client';

import { useRouter } from 'next/navigation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import StyleIcon from '@mui/icons-material/Style';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';

type Props = {
    onClose: () => void;
};

const steps = [
    {
        icon: <AddCircleOutlineIcon className="text-blue-400" fontSize="large" />,
        title: 'Registra tu primera prenda',
        description: 'Agrega prendas a tu armario con foto, marca, tipo y colores.',
    },
    {
        icon: <CheckroomIcon className="text-blue-400" fontSize="large" />,
        title: 'Organiza tu armario',
        description: 'Filtra y visualiza todas tus prendas fácilmente.',
    },
    {
        icon: <StyleIcon className="text-blue-400" fontSize="large" />,
        title: 'Crea outfits',
        description: 'Combina prendas y crea looks para cada ocasión.',
    },
    {
        icon: <CheckCircleOutlineIcon className="text-blue-400" fontSize="large" />,
        title: 'Lleva el control',
        description: 'Descubre cuáles son tus prendas más y menos usadas.',
    },
];

export default function WelcomeModal({ onClose }: Props) {
    const router = useRouter();

    const handleStart = () => {
        localStorage.removeItem('isNewUser');
        onClose();
        router.push('/register-garment');
    };

    const handleSkip = () => {
        localStorage.removeItem('isNewUser');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-[#1a1f2e] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
                <div className="text-center">
                    <h2 className="text-white text-2xl font-bold">¡Bienvenido a WARD! 👋</h2>
                    <p className="text-white/60 text-sm mt-2">
                        Tu armario digital está listo. Aquí te explicamos cómo empezar.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="mt-1 shrink-0">{step.icon}</div>
                            <div>
                                <p className="text-white font-semibold text-sm">{step.title}</p>
                                <p className="text-white/50 text-xs mt-0.5">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleStart}
                        className="w-full rounded-full py-3 text-white font-semibold bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 transition"
                    >
                        Agregar mi primera prenda →
                    </button>
                    <button
                        onClick={handleSkip}
                        className="w-full rounded-full py-3 text-white/50 text-sm hover:text-white/80 transition"
                    >
                        Explorar primero
                    </button>
                </div>
            </div>
        </div>
    );
}
