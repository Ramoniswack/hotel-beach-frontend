import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Hoteller Beach Hotel - Luxury Santorini Resort',
  description: 'Unwind the clock of modern life. Unlock the door to a wonder of the world.',
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
