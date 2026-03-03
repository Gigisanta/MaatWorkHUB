'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { DesktopSidebar, MobileNav, NavItem } from '@maatwork/ui';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  CreditCard,
  UsersRound,
  Settings,
} from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const app = params.appSlug as string;

  const appNav: NavItem[] = [
    { title: 'Dashboard', href: `/${app}`, icon: LayoutDashboard },
    { title: 'Agenda', href: `/${app}/agenda`, icon: Calendar },
    { title: 'Clientes', href: `/${app}/clients`, icon: Users },
    { title: 'Suscripciones', href: `/${app}/subscriptions`, icon: CreditCard },
    { title: 'Grupos', href: `/${app}/groups`, icon: UsersRound },
    { title: 'Inventario', href: `/${app}/inventory`, icon: Package },
    { title: 'Configuración', href: `/${app}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileNav items={appNav} title={app.toUpperCase()} />
      <DesktopSidebar items={appNav} title={app.toUpperCase()} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
