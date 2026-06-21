import { PageHeader } from '@/components/layout/page-header';

export default function BannersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        description="Manage homepage and promotional banners"
        actions={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            + Add Banner
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="aspect-[16/6] animate-pulse rounded-md bg-muted" />
            <div className="mt-3 flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
