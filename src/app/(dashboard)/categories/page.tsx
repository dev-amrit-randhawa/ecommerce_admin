'use client';

import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  isActive: boolean;
  productCount: number;
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ categories: Category[] }>('/categories?tree=true');
        setCategories(data.categories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function renderCategory(cat: Category, indent: number = 0) {
    return (
      <div key={cat._id}>
        <div className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50" style={{ marginLeft: indent * 24 }}>
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${cat.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium">{cat.name}</span>
            <span className="text-xs text-muted-foreground">/{cat.slug}</span>
          </div>
          <span className="text-xs text-muted-foreground">{cat.productCount} products</span>
        </div>
        {cat.children?.map((child) => renderCategory(child, indent + 1))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories and hierarchy"
        actions={
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            + Add Category
          </button>
        }
      />
      <div className="rounded-lg border p-6">
        <div className="space-y-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
              ))
            : categories.map((cat) => renderCategory(cat))}
        </div>
      </div>
    </div>
  );
}
