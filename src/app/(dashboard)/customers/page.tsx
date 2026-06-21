import { PageHeader } from '@/components/layout/page-header';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="View and manage customer accounts" />
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Orders</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total Spent</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b">
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
