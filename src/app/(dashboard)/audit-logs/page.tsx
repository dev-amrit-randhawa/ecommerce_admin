import { PageHeader } from '@/components/layout/page-header';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="System activity history" />
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Resource</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">IP</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="border-b">
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
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
