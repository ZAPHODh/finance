'use client';

import { Search } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface WindowWithCommandMenu extends Window {
  openCommandMenu?: () => void;
}

export function SearchButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const openFn = (window as WindowWithCommandMenu).openCommandMenu;
      if (openFn) {
        openFn();
      }
    }
  };

  return (
    <SidebarMenuButton onClick={handleClick}>
      <Search />
      <span>Buscar</span>
    </SidebarMenuButton>
  );
}
