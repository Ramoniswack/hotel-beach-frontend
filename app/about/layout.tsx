import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Hoteller Beach Hotel',
  description: 'Discover the story behind Hoteller Beach Hotel, a luxury resort in Santorini offering world-class hospitality and breathtaking views.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
