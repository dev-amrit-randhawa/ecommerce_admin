'use client';

import { useCallback, useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

type Period = '7d' | '30d' | '90d' | '1y';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders?: number;
}

interface TopProduct {
  productId: string;
  name: string;
  revenue: number;
  quantity?: number;
}

interface RevenueResponse {
  period: string;
  data: RevenueDataPoint[];
  total?: number;
}

interface TopProductsResponse {
  period: string;
  data: TopProduct[];
}

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
  '1y': '1 Year',
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [revenue, setRevenue] = useState<RevenueDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const [revenueRes, productsRes] = await Promise.all([
        api.get<RevenueResponse>(`/analytics/revenue?period=${p}`).catch(() => null),
        api.get<TopProductsResponse>(`/analytics/top-products?period=${p}`).catch(() => null),
      ]);
      setRevenue(revenueRes?.data || []);
      setTopProducts(productsRes?.data || []);
    } catch {
      setRevenue([]);
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  function handlePeriodChange(p: Period) {
    setPeriod(p);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Detailed store performance metrics" />

      <div className="flex gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePeriodChange(p)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Revenue Trend</h3>
          <div className="mt-4">
            {loading ? (
              <div className="h-[300px] animate-pulse rounded bg-muted" />
            ) : revenue.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No revenue data available for this period.</p>
              </div>
            ) : (
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {revenue.map((point) => (
                  <div key={point.date} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(point.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-sm font-medium">
                      ₹{point.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Orders Trend</h3>
          <div className="mt-4">
            {loading ? (
              <div className="h-[300px] animate-pulse rounded bg-muted" />
            ) : revenue.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No order data available for this period.</p>
              </div>
            ) : (
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {revenue.map((point) => (
                  <div key={point.date} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(point.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-sm font-medium">
                      {point.orders ?? 0} orders
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Top Products</h3>
          <div className="mt-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No product data available for this period.</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">₹{product.revenue.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Top Categories</h3>
          <div className="mt-4 flex h-[120px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
