'use client';
import Banner from '../../common/components/Banner';
import GarmentCard from '../../common/components/GarmentCard';

export default function FeedPage() {
    const handleFavorite = (id: string, isFavorited: boolean) => {
        console.log(`Garment ${id} favorited: ${isFavorited}`);
    };

    return (
        <main style={{ backgroundColor: '#131620' }} className="min-h-screen">
            <Banner />

            {/* Resumen de tu armario */}
            <section className="px-8 md:px-16 py-14">
                {/* Header: dos columnas */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
                    <div>
                        <p className="text-blue-400 font-semibold text-sm mb-2">
                            Resumen de tu armario
                        </p>
                        <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight">
                            Tus prendas más<br />usadas
                        </h2>
                    </div>
                    <p className="text-white/80 text-base md:text-lg max-w-sm md:mt-8 leading-relaxed">
                        Tu estilo gira principalmente alrededor de prendas tipo{' '}
                        <strong className="text-white">Shirts</strong>, que se han convertido
                        en la base de la mayoría de tus outfits.
                    </p>
                </div>

                {/* Garment cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GarmentCard
                        label="Jacket"
                        isFavorited={false}
                        onFavorite={(isFav) => handleFavorite('1', isFav)}
                    />
                    <GarmentCard
                        label="Pants"
                        isFavorited={false}
                        onFavorite={(isFav) => handleFavorite('2', isFav)}
                    />
                    <GarmentCard
                        label="T-Shirt"
                        isFavorited={false}
                        onFavorite={(isFav) => handleFavorite('3', isFav)}
                    />
                </div>
            </section>
        </main>
    );
}