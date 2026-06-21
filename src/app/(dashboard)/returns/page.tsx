import { PageHeader } from '@/components/layout/page-header';

export default function ReturnsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Returns" description="Manage return requests" />
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No return requests yet.
      </div>
    </div>
  );
}
