export default function StudioHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">MRR</h3>
          <div className="text-2xl font-bold mt-2">$2,400</div>
        </div>
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">Active Clients</h3>
          <div className="text-2xl font-bold mt-2">12</div>
        </div>
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">Recent Deploys</h3>
          <div className="text-2xl font-bold mt-2">3</div>
        </div>
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground">Open Tasks</h3>
          <div className="text-2xl font-bold mt-2">5</div>
        </div>
      </div>
    </div>
  );
}
