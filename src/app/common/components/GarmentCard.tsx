'use client';

import { useState } from 'react';
import Link from 'next/link';

import FavoriteButton from './FavoriteButton';

interface GarmentCardProps {
    id: string;
    image?: string;
    imageAlt?: string;
    label: string;
    name?: string;
    brandName?: string | null;
    colors?: string[];
    onFavorite?: (isFavorited: boolean) => void;
    isFavorited?: boolean;
    className?: string;
}

const garmentImageMap: Record<string, string> = {
    'T-Shirt': '/assets/Tshirt.svg',
    Shirt: '/assets/Shirt.svg',
    Pants: '/assets/pants.svg',
    Jacket: '/assets/Jacket.svg',
    Sweater: '/assets/Sweater.svg',
    Dress: '/assets/Dress.svg',
    Skirt: '/assets/Skirt.svg',
    Shoes: '/assets/Shoes.svg',
    Accessories: '/assets/Accessorie.svg',
};

function normalizeGarmentLabel(label: string): string {
    return label
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, ' ')
        .trim();
}

function getGarmentImage(label: string): string {
    const normalized = normalizeGarmentLabel(label);

    const mapping: Record<string, string> = {
        't shirt': '/assets/Tshirt.svg',
        tshirt: '/assets/Tshirt.svg',
        shirt: '/assets/Shirt.svg',
        pants: '/assets/pants.svg',
        trousers: '/assets/pants.svg',
        jean: '/assets/pants.svg',
        jacket: '/assets/Jacket.svg',
        coat: '/assets/Jacket.svg',
        sweater: '/assets/Sweater.svg',
        jumper: '/assets/Sweater.svg',
        dress: '/assets/Dress.svg',
        skirt: '/assets/Skirt.svg',
        shoes: '/assets/Shoes.svg',
        sneakers: '/assets/Shoes.svg',
        accessories: '/assets/Accessorie.svg',
        accessory: '/assets/Accessorie.svg',
    };

    return mapping[normalized] || '/assets/Accessorie.svg';
}

export default function GarmentCard({
    id,
    image,
    imageAlt = 'Garment',
    label,
    name,
    brandName,
    colors,
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
                    <div className="flex items-center justify-between p-6 pb-2">
                        <div>
                            <div className="inline-flex px-3.5 py-1 bg-white/25 rounded-full shadow-md mb-2">
                                <span className="text-white font-bold text-base">{label}</span>
                            </div>
                            {name && <div className="text-white font-semibold text-lg">{name}</div>}
                            {brandName && <div className="text-white/70 text-sm">{brandName}</div>}
                        </div>
                        <FavoriteButton isFavorited={isFavorited} onToggle={onFavorite} />
                    </div>

                    {/* Image Section */}
                    <div className="relative w-full aspect-square overflow-hidden px-6 pb-6">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <img
                                src={imageUrl}
                                alt={imageAlt}
                                className="w-full h-full object-contain"
                                onError={(event) => {
                                    const target = event.currentTarget as HTMLImageElement;
                                    if (target.src !== '/assets/Accessorie.svg') {
                                        target.src = '/assets/Accessorie.svg';
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* Color badges */}
                    {colors && colors.length > 0 && (
                        <div className="p-4 pt-0 flex flex-wrap gap-2">
                            {colors.map((c) => (
                                <span
                                    key={c}
                                    className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/25 text-white text-sm font-medium shadow-md"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
