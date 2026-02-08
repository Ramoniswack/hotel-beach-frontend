import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Hoteller Beach Hotel',
  description: 'Read the latest news, travel tips, and luxury hospitality insights from Hoteller Beach Hotel in Santorini.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
