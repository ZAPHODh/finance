'use client';

import { Search } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function SearchButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).openCommandMenu) {
      (window as any).openCommandMenu();
    }
  };

  return (
    <SidebarMenuButton onClick={handleClick}>
      <Search />
      <span>Buscar</span>
    </SidebarMenuButton>
  );
}
