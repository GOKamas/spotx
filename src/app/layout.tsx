import { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin', 'greek'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://spotx.me'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={`${montserrat.variable} ${inter.variable}`}>
      <body className={montserrat.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, backgroundColor: '#0d0d0d' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
