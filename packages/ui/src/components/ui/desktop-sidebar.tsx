"use client";

import { NavMain, NavItem } from "./nav-main";
import { cn } from "../../lib/utils";

interface DesktopSidebarProps {
  items: NavItem[];
  title: string;
  footer?: React.ReactNode;
}

export function DesktopSidebar({ items, title, footer }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-muted/20 sticky top-0 h-screen">
      <div className="flex h-14 items-center border-b px-6 font-bold text-lg">
        {title}
      </div>
      <div className="flex-1 overflow-auto py-4">
        <NavMain items={items} />
      </div>
      {footer && (
        <div className="border-t p-4">
          {footer}
        </div>
      )}
    </aside>
  );
}
