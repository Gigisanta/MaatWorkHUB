export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
          Create new tenant
        </button>
      </div>
      <div className="border rounded-lg p-6 flex items-center justify-center text-muted-foreground h-64 border-dashed">
        Empty state: No actual tenants displayed yet.
      </div>
    </div>
  );
}
