'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    const excluded = ['/login', '/register', '/forgot-password'];

    if (excluded.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        return null;
    }

    return (
        <footer className="w-full overflow-hidden">
    <img
        src="/assets/Footer.svg"
        alt="Footer"
        className="block w-full h-auto"
    />
</footer>
    );
}
