import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
