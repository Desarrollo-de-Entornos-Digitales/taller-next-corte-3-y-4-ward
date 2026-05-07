'use client';

import { useState } from 'react';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

interface GarmentCardProps {
    id: string;
    image?: string;
    imageAlt?: string;
    label: string;
    onFavorite?: (isFavorited: boolean) => void;
    isFavorited?: boolean;
    className?: string;
}

const garmentImageMap: Record<string, string> = {
    Jacket: '/assets/Jacket.svg',
    Shirt: '/assets/Shirt.svg',
    Pants: '/assets/pants.svg',
    'T-Shirt': '/assets/Tshirt.svg',
    Sweater: '/assets/Sweater.svg',
    Dress: '/assets/Dress.svg',
    Skirt: '/assets/Skirt.svg',
    Shoes: '/assets/Shoes.svg',
    Accessorie: '/assets/Accessorie.svg',
    Hoodie: '/assets/Accessorie.svg',
    Polo: '/assets/Shirt.svg',
    Blazer: '/assets/Jacket.svg',
    Shorts: '/assets/Accessorie.svg',
};

function getGarmentImage(label: string): string {
    return garmentImageMap[label] || '/assets/Accessorie.svg';
}

export default function GarmentCard({
    id,
    image,
    imageAlt = 'Garment',
    label,
    onFavorite,
    isFavorited = false,
    className = '',
}: GarmentCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const imageUrl = image || getGarmentImage(label);

    return (
        <Link href={`/feed/${id}`}>
            <div
                className={`group relative w-full max-w-sm overflow-hidden rounded-[29px] backdrop-blur-sm transition-all duration-300 cursor-pointer ${className}`}
                style={{
                    background: isHovered
                        ? 'radial-gradient(ellipse 66.06% 66.06% at 49.77% 50.00%, #3C6AEC 0%, #000022 100%)'
                        : 'radial-gradient(ellipse 86.28% 86.66% at 6.16% -0.00%, #3C6AEC 0%, #000022 100%)',
                    boxShadow:
                        '0px 5.87px 5.87px rgba(0, 0, 0, 0.25), 1.47px 1.47px 14.68px rgba(247, 253, 254, 0.60) inset',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Card Container */}
                <div className="flex flex-col h-full">
                    {/* Header with Label and Favorite Button */}
                    <div className="flex items-center justify-between p-6 pb-4">
                        <div className="inline-flex px-3.5 py-1 bg-white/25 rounded-full shadow-md">
                            <span className="text-white font-bold text-base">{label}</span>
                        </div>
                        <FavoriteButton isFavorited={isFavorited} onToggle={onFavorite} />
                    </div>

                    {/* Image Section */}
                    <div className="relative w-full aspect-square overflow-hidden px-6 pb-6">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
