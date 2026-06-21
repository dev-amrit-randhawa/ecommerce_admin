import { PageHeader } from '@/components/layout/page-header';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Detailed store performance metrics" />

      <div className="flex gap-2">
        {['7 Days', '30 Days', '90 Days', '1 Year'].map((period) => (
          <button
            key={period}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            {period}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Revenue Trend</h3>
          <div className="mt-4 h-[300px] animate-pulse rounded bg-muted" />
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Orders Trend</h3>
          <div className="mt-4 h-[300px] animate-pulse rounded bg-muted" />
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Top Products</h3>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Top Categories</h3>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
