import './globals.css';
import ConditionalNavBar from './ConditionalNavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="light">
      <body>
        <ConditionalNavBar />
        {children}
      </body>
    </html>
  );
}
