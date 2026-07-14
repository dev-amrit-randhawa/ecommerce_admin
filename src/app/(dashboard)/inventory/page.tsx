'use client';

import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface InventoryItem {
  _id: string;
  sku: string;
  productId: { name: string; slug: string };
  variantId: { sku: string; attributes: { name: string; value: string }[] };
  stock: number;
  reservedStock: number;
  availableStock: number;
  isLowStock: boolean;
}

interface Summary {
  totalSkus: number;
  lowStock: number;
  outOfStock: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');

  useEffect(() => {
    async function load() {
      try {
        const [inventoryData, summaryData] = await Promise.all([
          api.get<{ data: InventoryItem[]; pagination: unknown }>('/inventory?limit=100'),
          api.get<Summary>('/inventory/summary'),
        ]);
        setItems(inventoryData.data);
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to load inventory:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusOf = (item: InventoryItem): 'in' | 'low' | 'out' =>
    item.availableStock === 0 ? 'out' : item.isLowStock ? 'low' : 'in';

  const query = search.trim().toLowerCase();
  const filtered = items.filter((item) => {
    if (statusFilter !== 'all' && statusOf(item) !== statusFilter) return false;
    if (!query) return true;
    const variant = item.variantId?.attributes?.map((a) => a.value).join(' ') ?? '';
    return [item.sku, item.productId?.name, variant]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(query));
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track and manage stock levels" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total SKUs</p>
          <p className="mt-1 text-2xl font-bold">{summary?.totalSkus ?? '---'}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Low Stock Items</p>
          <p className="mt-1 text-2xl font-bold text-orange-500">{summary?.lowStock ?? '---'}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{summary?.outOfStock ?? '---'}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> In stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-400" /> Low stock (≤10)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-destructive" /> Out of stock
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, SKU, or variant…"
          className="w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'in' | 'low' | 'out')}
          className="rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All statuses</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        {(search || statusFilter !== 'all') && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{filtered.length} of {items.length}</span>
            <button
              type="button"
              onClick={() => { setSearch(''); setStatusFilter('all'); }}
              className="rounded-md border px-3 py-1.5 font-medium transition-colors hover:bg-muted"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variant</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reserved</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.length === 0
              ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      {items.length === 0 ? 'No inventory items yet.' : 'No items match your filters.'}
                    </td>
                  </tr>
                )
              : filtered.map((item) => {
                  const outOfStock = item.availableStock === 0;
                  const lowStock = !outOfStock && item.isLowStock;
                  return (
                    <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        {outOfStock ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Out of stock
                          </span>
                        ) : lowStock ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                            Low stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            In stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.sku}</td>
                      <td className="px-4 py-3 font-medium">{item.productId?.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.variantId?.attributes?.map((a) => a.value).join(' / ')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{item.stock}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{item.reservedStock}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${
                        outOfStock ? 'text-destructive' : lowStock ? 'text-orange-500' : 'text-foreground'
                      }`}>
                        {item.availableStock}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
