import { Garment } from '../app/common/services/garment.service';

export const mockGarments: Garment[] = [
    {
        id: '1',
        type: 'Jacket',
        name: 'Premium Leather Jacket',
        description: 'High-quality black leather jacket',
        image: '/assets/Jacket.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        type: 'Shirt',
        name: 'Casual Cotton Shirt',
        description: 'Comfortable white cotton shirt',
        image: '/assets/Shirt.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        type: 'Pants',
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans in dark blue',
        image: '/assets/pants.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        type: 'T-Shirt',
        name: 'Graphic Tee',
        description: 'Comfortable graphic printed t-shirt',
        image: '/assets/Tshirt.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        type: 'Sweater',
        name: 'Wool Sweater',
        description: 'Warm wool sweater in gray',
        image: '/assets/Sweater.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '6',
        type: 'Jacket',
        name: 'Denim Jacket',
        description: 'Classic denim jacket',
        image: '/assets/Jacket.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '7',
        type: 'Shorts',
        name: 'Casual Shorts',
        description: 'Comfortable cotton shorts',
        image: '/assets/Accessorie.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '8',
        type: 'Polo',
        name: 'Classic Polo',
        description: 'Elegant polo shirt in navy',
        image: '/assets/Shirt.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '9',
        type: 'Blazer',
        name: 'Formal Blazer',
        description: 'Professional blazer in dark gray',
        image: '/assets/Jacket.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const getMockGarments = (): Garment[] => {
    return mockGarments;
};
