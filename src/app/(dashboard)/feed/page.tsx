'use client';
import Banner from '../../common/components/Banner';
import GarmentCard from '../../common/components/GarmentCard';
import NavBar from '../../common/components/NavBar';

export default function FeedPage() {
    const handleFavorite = (id: string, isFavorited: boolean) => {
        console.log(`Garment ${id} favorited: ${isFavorited}`);
    };

    return (
        <main style={{ backgroundColor: '#131620' }} className="min-h-screen p-8">
            <NavBar />
            <Banner />

            {/* Garments Grid */}
            <section className="mt-12">
                <h2 className="text-white text-2xl font-bold mb-8">Latest Garments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <GarmentCard
                        label="Jacket"
                        isFavorited={false}
                        onFavorite={(isFav) => handleFavorite('1', isFav)}
                    />

                    <GarmentCard label="Shirt" isFavorited={true} onFavorite={(isFav) => handleFavorite('2', isFav)} />

                    <GarmentCard label="Pants" isFavorited={false} onFavorite={(isFav) => handleFavorite('3', isFav)} />
                </div>
            </section>
        </main>
    );
}
