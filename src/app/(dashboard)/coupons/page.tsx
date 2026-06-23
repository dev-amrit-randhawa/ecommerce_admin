'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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

interface CouponForm {
  code: string;
  description: string;
  type: string;
  value: string;
  minimumOrderAmount: string;
  usageLimit: string;
  validUntil: string;
  status: string;
}

const EMPTY_FORM: CouponForm = {
  code: '',
  description: '',
  type: 'percentage',
  value: '',
  minimumOrderAmount: '',
  usageLimit: '',
  validUntil: '',
  status: 'active',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CouponForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = useCallback(async () => {
    try {
      const data = await api.get<{ data: Coupon[]; pagination: unknown }>('/coupons?limit=20');
      setCoupons(data.data);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error('Coupon code is required');
      return;
    }
    if (!form.value) {
      toast.error('Value is required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/coupons', {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || undefined,
        type: form.type,
        value: parseFloat(form.value),
        minimumOrderAmount: form.minimumOrderAmount ? parseFloat(form.minimumOrderAmount) : undefined,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit, 10) : undefined,
        validUntil: form.validUntil || undefined,
        status: form.status,
      });
      toast.success('Coupon created successfully');
      setForm(EMPTY_FORM);
      setShowForm(false);
      setLoading(true);
      await fetchCoupons();
    } catch {
      toast.error('Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  }

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
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showForm ? 'Cancel' : '+ Create Coupon'}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm uppercase outline-none focus:ring-2 focus:ring-primary"
                placeholder="SUMMER20"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder={form.type === 'percentage' ? '20' : '500'}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min. Order Amount</label>
              <input
                type="number"
                value={form.minimumOrderAmount}
                onChange={(e) => setForm({ ...form, minimumOrderAmount: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Usage Limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Unlimited"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valid Until</label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Coupon'}
          </button>
        </form>
      )}

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
