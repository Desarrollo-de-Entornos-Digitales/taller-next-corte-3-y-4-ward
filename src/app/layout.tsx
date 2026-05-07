import './globals.css';
import ConditionalNavBar from './ConditionalNavBar';
import Footer from './common/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" data-theme="light">
            <body>
                <ConditionalNavBar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
