import FavoriteButton from './FavoriteButton';

interface GarmentCardProps {
    label: string;
    isFavorited: boolean;
    onFavorite: (isFavorited: boolean) => void;
}

export default function GarmentCard({ label, isFavorited, onFavorite }: GarmentCardProps) {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="h-48 bg-gray-600 rounded mb-4 flex items-center justify-center">
                <span className="text-white text-lg">{label}</span>
            </div>
            <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">{label}</h3>
                <FavoriteButton isFavorited={isFavorited} onToggle={onFavorite} />
            </div>
        </div>
    );
}
