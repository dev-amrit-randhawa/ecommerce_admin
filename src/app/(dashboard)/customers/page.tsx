'use client';

import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  orderCount?: number;
  totalSpent?: number;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ data: Customer[]; pagination: unknown }>('/users?limit=20');
        setCustomers(data.data || []);
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-muted-foreground">No customers found</p>
                  <p className="mt-1 text-xs text-muted-foreground">Customer data will appear here as orders are placed.</p>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{customer.email}</td>
                  <td className="px-4 py-3 text-sm">{customer.orderCount ?? 0}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {typeof customer.totalSpent === 'number' ? `₹${customer.totalSpent.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
