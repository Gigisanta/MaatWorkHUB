import { db } from "@maatwork/database";
import { tenants, users } from "@maatwork/database/schema";
import { count } from "drizzle-orm";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardSkeleton, 
  RecentActivity,
  ActivityItem,
  CardDescription
} from "@maatwork/ui";
import { Suspense } from "react";
import { 
  Building2, 
  Users, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus,
  Clock
} from "lucide-react";

async function StudioKPIs() {
  const [
    [tenantsData],
    [usersData]
  ] = await Promise.all([
    db.select({ count: count() }).from(tenants),
    db.select({ count: count() }).from(users),
  ]);

  const simulatedMRR = (tenantsData?.count || 0) * 120000;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Ingresos Est. (MRR)</CardTitle>
          <Zap className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${simulatedMRR.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+ARS 240k vs mes pasado</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tenants Activos</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tenantsData?.count || 0}</div>
          <p className="text-xs text-muted-foreground">+2 nuevos hoy</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usersData?.count || 0}</div>
          <p className="text-xs text-muted-foreground">+12% de crecimiento</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">SLA de Soporte</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">99.9%</div>
          <p className="text-xs text-muted-foreground">Tiempo de respuesta &lt; 2h</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StudioKPIsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export default async function StudioHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Studio Dashboard</h1>
        <p className="text-muted-foreground italic">Vista global del ecosistema Maatwork.</p>
      </div>
      
      <Suspense fallback={<StudioKPIsLoading />}>
        <StudioKPIs />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity 
          items={mockStudioActivity} 
          className="col-span-4"
        />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Monitoreo en tiempo real de servicios core.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div className="text-sm font-medium">Todos los servicios operativos</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">API Latency</div>
                  <div className="text-lg font-mono">24ms</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">DB Load</div>
                  <div className="text-lg font-mono">12%</div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2 italic">Próximo despliegue programado:</div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>Mañana, 04:00 AM (v1.1.0)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const mockStudioActivity: ActivityItem[] = [
  {
    id: "1",
    title: "Nuevo Tenant: Natatorio Splasher",
    description: "Se ha activado una nueva suscripción 'Starter' para el tenant splasher-gym.",
    timestamp: "Hace 15 minutos",
    icon: Building2,
    variant: "success",
  },
  {
    id: "2",
    title: "Actualización de Seguridad",
    description: "Parche de middleware v1.0.1 aplicado a todas las apps del monorepo.",
    timestamp: "Hace 2 horas",
    icon: CheckCircle2,
    variant: "default",
  },
  {
    id: "3",
    title: "Pago Fallido Detectado",
    description: "Error en procesamiento de cobro para 'Peluquería Glam'.",
    timestamp: "Hace 4 horas",
    icon: AlertCircle,
    variant: "destructive",
  },
  {
    id: "4",
    title: "Nuevo Registro de Usuario",
    description: "Federico L. se ha unido como administrador de Studio.",
    timestamp: "Ayer",
    icon: UserPlus,
    variant: "default",
  },
];
