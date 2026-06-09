import './globals.css';
import ConditionalNavBar from './ConditionalNavBar';
import Footer from './common/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" data-theme="light">
            <body className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
                <ConditionalNavBar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
