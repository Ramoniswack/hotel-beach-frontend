import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Santorini - Hoteller Beach Hotel',
  description: 'Discover the beauty of Santorini, Greece. Explore local attractions, stunning views, and unforgettable experiences near our luxury hotel.',
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
