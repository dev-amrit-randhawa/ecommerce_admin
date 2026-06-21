import { PageHeader } from '@/components/layout/page-header';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure store settings" />

      <div className="space-y-6">
        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">General</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <input
                defaultValue="Speffo"
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Shipping</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Free Shipping Threshold</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Default Shipping Charge</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        <button className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Save Settings
        </button>
      </div>
    </div>
  );
}
