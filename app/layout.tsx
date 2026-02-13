import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import '../styles/mobile-optimizations.css';
import AuthProvider from '@/components/AuthProvider';
import UnifiedPageLoader from '@/components/UnifiedPageLoader';
import LayoutWrapper from '@/components/LayoutWrapper';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Hoteller Beach Hotel - Luxury Santorini Resort',
  description: 'Unwind the clock of modern life. Unlock the door to a wonder of the world.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#59a4b5',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AuthProvider>
          <UnifiedPageLoader />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
