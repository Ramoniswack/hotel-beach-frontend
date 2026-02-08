import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Rooms & Suites - Hoteller Beach Hotel',
  description: 'Explore our luxury rooms and suites with stunning sea views. From Superior Rooms to Luxury Suites, find your perfect sanctuary in Santorini.',
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
