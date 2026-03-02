"use client";

import * as React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Separator
} from "@maatwork/ui";
import { Building2, Globe, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface HubContextSwitcherProps {
  tenants: Tenant[];
  currentTenant?: string;
}

export function HubContextSwitcher({ tenants, currentTenant }: HubContextSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleValueChange = (value: string) => {
    if (value === "global") {
      router.push("/");
    } else {
      // Management Mode: Stay within studio app for founder convenience
      router.push(`/${value}`);
    }
  };

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Contexto del Hub
        </span>
      </div>
      <Select 
        defaultValue={pathname.split('/')[1] || currentTenant || "global"} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full bg-background/50 border-muted-foreground/20 hover:bg-accent transition-colors">
          <SelectValue placeholder="Seleccionar Contexto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>MaatWork HQ (Global)</span>
            </div>
          </SelectItem>
          <Separator className="my-1" />
          {tenants.map((t) => (
            <SelectItem key={t.id} value={t.slug}>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>{t.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
