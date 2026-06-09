import { Garment } from '../app/common/services/garment.service';

export const mockGarments: Garment[] = [
    {
        id: '1',
        type: 'Jacket',
        brand: { id: 1, name: 'Ward' },
        color: 'Black',
        name: 'Premium Leather Jacket',
        description: 'High-quality black leather jacket',
        image_url: '/assets/Jacket.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        type: 'Shirt',
        brand: { id: 2, name: 'Stella' },
        color: 'White',
        name: 'Casual Cotton Shirt',
        description: 'Comfortable white cotton shirt',
        image_url: '/assets/Shirt.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        type: 'Pants',
        brand: { id: 3, name: 'Norde' },
        color: 'Blue',
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans in dark blue',
        image_url: '/assets/pants.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        type: 'T-Shirt',
        brand: { id: 4, name: 'Another' },
        color: 'Cream',
        name: 'Graphic Tee',
        description: 'Comfortable graphic printed t-shirt',
        image_url: '/assets/Tshirt.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        type: 'Sweater',
        brand: { id: 5, name: 'Nordic' },
        color: 'Brown',
        name: 'Wool Sweater',
        description: 'Warm wool sweater in gray',
        image_url: '/assets/Sweater.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '6',
        type: 'Jacket',
        brand: { id: 6, name: 'Urban' },
        color: 'Blue',
        name: 'Denim Jacket',
        description: 'Classic denim jacket',
        image_url: '/assets/Jacket.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '7',
        type: 'Accessories',
        brand: { id: 7, name: 'Vintage' },
        color: 'Brown',
        name: 'Corduroy Cap',
        description: 'Warm corduroy cap with patch',
        image_url: '/assets/Accessorie.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const garmentTypes = [
    'T-Shirt',
    'Shirt',
    'Pants',
    'Jacket',
    'Sweater',
    'Dress',
    'Skirt',
    'Shoes',
    'Accessories',
];

export const GARMENT_IMAGE_MAP: Record<string, string> = {
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

export function getFallbackGarmentImage(label?: string, name?: string): string {
    const value = `${label ?? ''} ${name ?? ''}`
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, ' ')
        .trim();

    if (/(dress|vestido|gown)/.test(value)) return GARMENT_IMAGE_MAP.Dress;
    if (/(shoe|shoes|sneakers|zapatillas|sneaker|boot)/.test(value)) return GARMENT_IMAGE_MAP.Shoes;
    if (/(jacket|chaqueta|abrigo|coat|leather)/.test(value)) return GARMENT_IMAGE_MAP.Jacket;
    if (/(t shirt|tshirt|shirt|camisa|polo|playera|remera|tee|cotton)/.test(value)) return GARMENT_IMAGE_MAP['T-Shirt'];
    if (/(pants|pantalones|pantalon|jeans|jean|denim|trouser|slim fit)/.test(value)) return GARMENT_IMAGE_MAP.Pants;
    if (/(sweater|sueter|jumper|wool)/.test(value)) return GARMENT_IMAGE_MAP.Sweater;
    if (/(skirt|falda)/.test(value)) return GARMENT_IMAGE_MAP.Skirt;
    if (/(accessories|accessory|accesorios|cap|hat|bag|corduroy)/.test(value)) return GARMENT_IMAGE_MAP.Accessories;

    return GARMENT_IMAGE_MAP.Accessories;
}

export function resolveGarmentImage(image?: string, label?: string, name?: string): string {
    if (image) {
        const trimmed = image.trim();
        if (/^https?:\/\//.test(trimmed)) return trimmed;
        if (trimmed.startsWith('/')) return trimmed;
        if (trimmed.startsWith('assets/')) return `/${trimmed}`;
        return trimmed;
    }

    return getFallbackGarmentImage(label, name);
}

export function getGarmentImageUrl(garment: Garment): string | undefined {
    return garment.image_url || garment.imageUrl;
}

export function getGarmentColors(garment: Garment): string[] {
    const garmentColors = Array.isArray(garment.garment_colors) ? garment.garment_colors : [];
    const colors = [
        ...(garmentColors.map((gc) => gc.color?.name).filter(Boolean) as string[]),
        ...(garment.color ? [garment.color] : []),
    ];
    return Array.from(new Set(colors));
}

export const getMockGarments = (): Garment[] => mockGarments;
