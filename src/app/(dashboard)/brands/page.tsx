'use client';

import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  isActive: boolean;
  productCount: number;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ data: Brand[]; pagination: unknown }>('/brands?limit=50');
        setBrands(data.data);
      } catch (err) {
        console.error('Failed to load brands:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage product brands"
        actions={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            + Add Brand
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4 text-center">
                <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-muted" />
                <div className="mx-auto mt-3 h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))
          : brands.map((brand) => (
              <div key={brand._id} className="rounded-lg border p-4 text-center transition-colors hover:bg-muted/50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-bold">
                  {brand.name.charAt(0)}
                </div>
                <p className="mt-3 text-sm font-medium">{brand.name}</p>
                <p className="text-xs text-muted-foreground">{brand.productCount} products</p>
                <span className={`mt-2 inline-block h-2 w-2 rounded-full ${brand.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
            ))}
      </div>
    </div>
  );
}
