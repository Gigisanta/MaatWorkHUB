import { db } from "@maatwork/database";
import { apps, clients, subscriptions, attendances } from "@maatwork/database/schema";
import { eq, count } from "drizzle-orm";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardSkeleton,
  RecentActivity,
  ActivityItem
} from "@maatwork/ui";
import { Suspense } from "react";
import { 
  Users, 
  CreditCard, 
  Calendar, 
  TrendingUp,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

async function DashboardKPIs({ appId }: { appId: string }) {
  const [
    [totalClientsRes],
    [activeSubsRes],
    [todayAttendancesRes]
  ] = await Promise.all([
    db.select({ count: count() }).from(clients).where(eq(clients.appId, appId)),
    db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.appId, appId)),
    db.select({ count: count() }).from(attendances).where(eq(attendances.appId, appId)),
  ]);

  const totalClients = totalClientsRes?.count || 0;
  const activeSubs = activeSubsRes?.count || 0;
  const todayAttendances = todayAttendancesRes?.count || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Clientes Totales</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">+3 esta semana</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Suscripciones Activas</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeSubs}</div>
          <p className="text-xs text-muted-foreground">92% al día</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Asistencia Hoy</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayAttendances}</div>
          <p className="text-xs text-muted-foreground">+5% vs ayer</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Estado General</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono tracking-tighter">ESTABLE</div>
          <p className="text-xs text-muted-foreground italic">Sin alertas pendientes</p>
        </CardContent>
      </Card>
    </div>
  );
}

function KPIsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export default async function AppDashboardPage({ params }: { params: Promise<{ app: string }> }) {
  const { app: appSlug } = await params;
  
  const appRecord = await db.query.apps.findFirst({
    where: eq(apps.slug, appSlug),
  });

  if (!appRecord) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">App Not Found</h1>
        <p>No workspace exists for &apos;{appSlug}&apos;</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Bienvenido, {appRecord.name}</h1>
        <p className="text-muted-foreground italic">Tu panel de {appRecord.template} está listo para operar.</p>
      </div>
      
      <Suspense fallback={<KPIsLoading />}>
        <DashboardKPIs appId={appRecord.id} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity 
          items={mockAppActivity} 
          className="col-span-4"
          title="Novedades del centro"
          description="Últimos movimientos de clientes y pagos."
        />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Acciones frecuentes para tu día a día.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <a href={`/${appSlug}/agenda`} className="flex items-center p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="text-sm font-medium">Ver Agenda del Día</div>
            </a>
            <a href={`/${appSlug}/clients`} className="flex items-center p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors gap-3">
              <UserPlus className="h-5 w-5 text-primary" />
              <div className="text-sm font-medium">Registrar Nuevo Cliente</div>
            </a>
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="text-xs text-muted-foreground italic flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Vibe-codeado con Maatwork
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const mockAppActivity: ActivityItem[] = [
  {
    id: "1",
    title: "Nueva Inscripción",
    description: "Carlos Gómez se inscribió al grupo 'Natación Adultos - 19hs'.",
    timestamp: "Hace 10 minutos",
    icon: <UserPlus />,
    variant: "success",
  },
  {
    id: "2",
    title: "Pago Registrado",
    description: "Marta R. pagó la cuota mensual de Marzo.",
    timestamp: "Hace 2 horas",
    icon: <CheckCircle />,
    variant: "success",
  },
  {
    id: "3",
    title: "Inasistencia Notificada",
    description: "Jorge L. notificó que no asistirá a la clase de mañana.",
    timestamp: "Hace 5 hours",
    icon: <Clock />,
    variant: "warning",
  },
  {
    id: "4",
    title: "Ficha Médica Vencida",
    description: "Lucía P. tiene su certificado médico vencido.",
    timestamp: "Ayer",
    icon: <AlertCircle />,
    variant: "destructive",
  },
];
