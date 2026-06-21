'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface Order {
  _id: string;
  orderNumber: string;
  userId: { firstName: string; lastName: string; email: string };
  total: number;
  status: string;
  createdAt: string;
}

const STATUSES = ['All', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const statusFilter = activeTab === 'All' ? '' : `&status=${activeTab}`;
        const data = await api.get<{ data: Order[]; pagination: unknown }>(`/orders?limit=20&sortBy=createdAt&sortOrder=desc${statusFilter}`);
        setOrders(data.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeTab]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="View and manage customer orders" />

      <div className="flex gap-2">
        {STATUSES.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            {tab === 'All' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order #</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              : orders.map((order) => (
                  <tr key={order._id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link href={`/orders/${order._id}`} className="text-sm font-medium text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {order.userId?.firstName} {order.userId?.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ₹{(order.total / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
