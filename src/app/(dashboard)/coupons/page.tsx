'use client';

import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: string;
  value: number;
  usageLimit?: number;
  usedCount: number;
  validUntil: string;
  status: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ data: Coupon[]; pagination: unknown }>('/coupons?limit=20');
        setCoupons(data.data);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Create and manage discount coupons"
        actions={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            + Create Coupon
          </button>
        }
      />
      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Usage</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expires</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              : coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-sm font-bold">{coupon.code}</td>
                    <td className="px-4 py-3 text-sm">{coupon.description}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : coupon.type === 'fixed_amount' ? `₹${coupon.value}` : 'Free Ship'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(coupon.validUntil).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[coupon.status] || ''}`}>
                        {coupon.status}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
