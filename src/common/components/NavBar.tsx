import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className="bg-gray-900 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-xl font-bold">
                    Ward
                </Link>
                <div className="space-x-4">
                    <Link href="/feed" className="text-white hover:text-gray-300">
                        Feed
                    </Link>
                    <Link href="/create-outfit" className="text-white hover:text-gray-300">
                        Create Outfit
                    </Link>
                    <Link href="/profile" className="text-white hover:text-gray-300">
                        Profile
                    </Link>
                </div>
            </div>
        </nav>
    );
}
