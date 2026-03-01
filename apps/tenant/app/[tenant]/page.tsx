export default async function TenantDashboardPage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenantSlug = resolvedParams.tenant;
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to {tenantSlug}</h1>
      <p className="text-muted-foreground">This is your individual dynamic dashboard securely isolated.</p>
      
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-semibold text-sm text-gray-500">Total Clients</h3>
          <div className="text-2xl font-bold mt-2">143</div>
        </div>
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-semibold text-sm text-gray-500">Active Subscriptions</h3>
          <div className="text-2xl font-bold mt-2">128</div>
        </div>
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-semibold text-sm text-gray-500">Today's Attendances</h3>
          <div className="text-2xl font-bold mt-2">32</div>
        </div>
      </div>
    </div>
  );
}
