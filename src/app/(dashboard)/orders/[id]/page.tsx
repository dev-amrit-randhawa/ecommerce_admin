import { PageHeader } from '@/components/layout/page-header';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title={`Order #${id}`} description="Order details and management" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Order Items</h2>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 rounded-md border p-3">
                  <div className="h-16 w-16 animate-pulse rounded-md bg-muted" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Timeline</h2>
            <div className="mt-4 space-y-4">
              {['Order Placed', 'Payment Confirmed', 'Processing'].map((step) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{step}</p>
                    <p className="text-xs text-muted-foreground">---</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Update Status</h2>
            <select className="mt-3 w-full rounded-md border bg-background px-3 py-2 text-sm">
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Processing</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
            <button className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Update
            </button>
          </section>

          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Shipping Address</h2>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-40 animate-pulse rounded bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            </div>
          </section>

          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Payment</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>---</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>---</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>---</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
