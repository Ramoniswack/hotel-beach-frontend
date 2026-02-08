import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Hoteller Beach Hotel',
  description: 'Get in touch with Hoteller Beach Hotel. Located in the center of Santorini, Greece. Contact us for reservations and inquiries.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
