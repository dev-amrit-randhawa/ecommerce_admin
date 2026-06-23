'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface OrderItem {
  productId: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingAddress {
  name: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface TimelineEvent {
  status: string;
  timestamp: string;
  note?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  timeline?: TimelineEvent[];
  createdAt: string;
}

const STATUSES = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await api.get<Order>(`/orders/${id}`);
      setOrder(data);
      setSelectedStatus(data.status);
    } catch {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleUpdateStatus() {
    if (!selectedStatus || selectedStatus === order?.status) {
      toast.error('Please select a different status');
      return;
    }
    setUpdating(true);
    try {
      await api.patch(`/orders/${id}/status`, { status: selectedStatus });
      toast.success('Order status updated');
      await fetchOrder();
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title={`Order #${id.slice(-8)}`} description="Order details and management" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-lg border p-6">
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
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
          </div>
          <div className="space-y-6">
            <div className="h-40 animate-pulse rounded-lg border bg-muted" />
            <div className="h-32 animate-pulse rounded-lg border bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <PageHeader title="Order Not Found" description="The requested order could not be loaded" />
        <div className="rounded-lg border p-12 text-center">
          <p className="text-sm text-muted-foreground">Order not found or you do not have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order #${order.orderNumber || id.slice(-8)}`}
        description="Order details and management"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Order Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 rounded-md border p-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Timeline</h2>
            <div className="mt-4 space-y-4">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium capitalize">{event.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString('en-IN')}
                      </p>
                      {event.note && <p className="text-xs text-muted-foreground">{event.note}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium capitalize">{order.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Update Status</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-3 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === order.status}
              className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
          </section>

          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Shipping Address</h2>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
              {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          </section>

          <section className="rounded-lg border p-6">
            <h2 className="font-semibold">Payment</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹{order.shippingCharge.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between pt-2 text-xs">
                  <span className="text-muted-foreground">Method</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
              )}
              {order.paymentStatus && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="capitalize">{order.paymentStatus}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
