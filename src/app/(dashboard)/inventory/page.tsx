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

  useEffect(() => {
    async function load() {
      try {
        const [inventoryData, summaryData] = await Promise.all([
          api.get<{ data: InventoryItem[]; pagination: unknown }>('/inventory?limit=30'),
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

      <div className="rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Variant</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reserved</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Available</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              : items.map((item) => (
                  <tr key={item._id} className={`border-b ${item.isLowStock ? 'bg-orange-50' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3 text-sm">{item.productId?.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {item.variantId?.attributes?.map((a) => a.value).join(' / ')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{item.stock}</td>
                    <td className="px-4 py-3 text-sm">{item.reservedStock}</td>
                    <td className="px-4 py-3 text-sm font-medium">{item.availableStock}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
