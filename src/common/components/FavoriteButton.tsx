interface FavoriteButtonProps {
    isFavorited: boolean;
    onToggle: (isFavorited: boolean) => void;
}

export default function FavoriteButton({ isFavorited, onToggle }: FavoriteButtonProps) {
    return (
        <button
            onClick={() => onToggle(!isFavorited)}
            className={`p-2 rounded-full ${isFavorited ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
        >
            {isFavorited ? '❤️' : '🤍'}
        </button>
    );
}
