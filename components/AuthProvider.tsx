'use client';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Zustand persist middleware handles loading from localStorage automatically
  return <>{children}</>;
}
