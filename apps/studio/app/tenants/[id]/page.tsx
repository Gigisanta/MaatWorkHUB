import { notFound } from "next/navigation";
import { db } from "@maatwork/database";
import { tenants, users, clients } from "@maatwork/database/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button
} from "@maatwork/ui";
import Link from "next/link";
import { ArrowLeft, Users, Building, Activity } from "lucide-react";
import { ProjectHub } from "../components/project-hub";

export default async function TenantDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const tenantId = resolvedParams.id;

  const tenantRecords = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  const tenant = tenantRecords[0];

  if (!tenant) {
    notFound();
  }

  const tenantUsers = await db.select().from(users).where(eq(users.tenantId, tenantId));
  const tenantClients = await db.select().from(clients).where(eq(clients.tenantId, tenantId));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenants">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
          <p className="text-muted-foreground">
            {tenant.slug}.maat.work • Template: <span className="capitalize">{tenant.template}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantUsers.length}</div>
            <p className="text-xs text-muted-foreground">Admins and employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantClients.length}</div>
            <p className="text-xs text-muted-foreground">Registered in platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground">Since {tenant.createdAt?.toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tenant Users</CardTitle>
            <CardDescription>People who can manage this tenant.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tenantUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add more cards for settings, subscription, etc. */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Advanced details and API access.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Tenant ID</p>
                <p className="text-sm text-muted-foreground font-mono">{tenant.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Custom Domain</p>
                <p className="text-sm text-muted-foreground">{tenant.domain || "None configured"}</p>
              </div>
              <Button variant="destructive" className="mt-4">Suspend Tenant</Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Hub (GitHub & Vercel) */}
        <div className="md:col-span-2">
            <ProjectHub 
                tenantId={tenant.id}
                githubRepo={tenant.githubRepo} 
                vercelProjectId={tenant.vercelProjectId} 
                vercelUrl={tenant.vercelUrl} 
                isInternal={tenant.isInternal}
            />
        </div>
      </div>
    </div>
  );
}
