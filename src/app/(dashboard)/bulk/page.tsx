import { Download, Upload } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';

export default function BulkOperationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bulk Operations" description="Import and export data in bulk" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Import</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload CSV/Excel files to bulk create or update records.
          </p>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
              Import Products
            </button>
            <button className="w-full rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
              Import Inventory
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Export</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Download data as CSV for reporting or backup.
          </p>
          <div className="mt-4 space-y-3">
            <button className="w-full rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
              Export Products
            </button>
            <button className="w-full rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
              Export Orders
            </button>
            <button className="w-full rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
              Export Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
