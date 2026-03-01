"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { DesktopSidebar, MobileNav, NavItem } from "@maatwork/ui";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Package, 
  CreditCard, 
  UsersRound,
  Settings 
} from "lucide-react";

export default function TenantLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const tenant = params.tenant as string;

  const tenantNav: NavItem[] = [
    { title: "Dashboard", href: `/${tenant}`, icon: LayoutDashboard },
    { title: "Agenda", href: `/${tenant}/agenda`, icon: Calendar },
    { title: "Clientes", href: `/${tenant}/clients`, icon: Users },
    { title: "Suscripciones", href: `/${tenant}/subscriptions`, icon: CreditCard },
    { title: "Grupos", href: `/${tenant}/groups`, icon: UsersRound },
    { title: "Inventario", href: `/${tenant}/inventory`, icon: Package },
    { title: "Configuración", href: `/${tenant}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <MobileNav items={tenantNav} title={tenant.toUpperCase()} />
      <DesktopSidebar items={tenantNav} title={tenant.toUpperCase()} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
