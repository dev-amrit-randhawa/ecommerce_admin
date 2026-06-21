import { PageHeader } from '@/components/layout/page-header';

export default function CmsPagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="CMS Pages"
        description="Manage content pages (FAQ, policies, etc.)"
        actions={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            + New Page
          </button>
        }
      />
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Updated</th>
            </tr>
          </thead>
          <tbody>
            {['FAQ', 'Privacy Policy', 'Return Policy', 'Terms & Conditions', 'Shipping Policy'].map(
              (page) => (
                <tr key={page} className="border-b">
                  <td className="px-4 py-3 text-sm font-medium">{page}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    /{page.toLowerCase().replace(/[&\s]+/g, '-')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                      Published
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">---</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
