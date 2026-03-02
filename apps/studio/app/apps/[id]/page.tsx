import { notFound } from "next/navigation";
import { db } from "@maatwork/database";
import { apps, users, clients } from "@maatwork/database/schema";
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

export default async function AppDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const appRecords = await db.select().from(apps).where(eq(apps.id, appId));
  const app = appRecords[0];

  if (!app) {
    notFound();
  }

  const appUsers = await db.select().from(users).where(eq(users.appId, appId));
  const appClients = await db.select().from(clients).where(eq(clients.appId, appId));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/apps">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>
          <p className="text-muted-foreground">
            {app.slug}.maat.work • Template: <span className="capitalize">{app.template}</span>
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
            <div className="text-2xl font-bold">{appUsers.length}</div>
            <p className="text-xs text-muted-foreground">Admins and employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appClients.length}</div>
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
            <p className="text-xs text-muted-foreground">Since {app.createdAt?.toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>App Users</CardTitle>
            <CardDescription>People who can manage this app.</CardDescription>
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
                {appUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  appUsers.map((user) => (
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
                <p className="text-sm font-medium">App ID</p>
                <p className="text-sm text-muted-foreground font-mono">{app.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Custom Domain</p>
                <p className="text-sm text-muted-foreground">{app.domain || "None configured"}</p>
              </div>
              <Button variant="destructive" className="mt-4">Suspend App</Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Hub (GitHub & Vercel & Neon) */}
        <div className="md:col-span-2">
            <ProjectHub 
                appId={app.id}
                githubRepo={app.githubRepo} 
                vercelProjectId={app.vercelProjectId} 
                vercelUrl={app.vercelUrl} 
                neonUrl={app.neonUrl}
                isInternal={app.isInternal}
            />
        </div>
      </div>
    </div>
  );
}
