'use client';

import { useEffect } from 'react';
import { initializeApp } from '@/lib/capacitor';

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeApp().catch(console.error);
  }, []);

  return <>{children}</>;
}
