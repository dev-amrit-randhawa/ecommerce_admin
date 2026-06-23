'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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

interface BrandForm {
  name: string;
  description: string;
  isActive: boolean;
}

const EMPTY_FORM: BrandForm = { name: '', description: '', isActive: true };

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BrandForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      const data = await api.get<{ data: Brand[]; pagination: unknown }>('/brands?limit=50');
      setBrands(data.data);
    } catch {
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Brand name is required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/brands', {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        isActive: form.isActive,
      });
      toast.success('Brand created successfully');
      setForm(EMPTY_FORM);
      setShowForm(false);
      setLoading(true);
      await fetchBrands();
    } catch {
      toast.error('Failed to create brand');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage product brands"
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showForm ? 'Cancel' : '+ Add Brand'}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brand name"
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
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="brand-active"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border"
            />
            <label htmlFor="brand-active" className="text-sm font-medium">Active</label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Brand'}
          </button>
        </form>
      )}

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
