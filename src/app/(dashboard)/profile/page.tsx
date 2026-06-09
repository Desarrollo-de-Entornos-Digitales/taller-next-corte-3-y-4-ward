"use client";

import ProfileForm from './components/ProfileForm';
import FavoritesGrid from './components/FavoritesGrid';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12 ">
            <div className="max-w-5xl mx-auto pt-15">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white">Mi perfil</h1>
                    <p className="text-white/60 mt-2">Gestiona tu información de cuenta y revisa tus prendas favoritas.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ProfileForm />
                    </div>

                    <aside className="lg:col-span-1">
                        <FavoritesGrid />
                    </aside>
                </div>
            </div>
        </div>
    );
}
