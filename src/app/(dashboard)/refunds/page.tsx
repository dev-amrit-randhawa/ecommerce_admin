import { PageHeader } from '@/components/layout/page-header';

export default function RefundsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Refunds" description="Track refund processing" />
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No refunds to display.
      </div>
    </div>
  );
}
