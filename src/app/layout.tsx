import './globals.css';
import NavBar from "./common/components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="light">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
