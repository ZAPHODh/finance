'use client';

import * as React from 'react';
import { CommandMenu } from './command-menu';

interface CommandMenuProviderProps {
  children: React.ReactNode;
}

export function CommandMenuProvider({ children }: CommandMenuProviderProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Expose open function globally so sidebar can trigger it
  React.useEffect(() => {
    (window as any).openCommandMenu = () => setOpen(true);
  }, []);

  return (
    <>
      {children}
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
