'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

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

interface CategoryForm {
  name: string;
  parentId: string;
  isActive: boolean;
}

const EMPTY_FORM: CategoryForm = { name: '', parentId: '', isActive: true };

function flattenCategories(cats: Category[], prefix: string = ''): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = [];
  for (const cat of cats) {
    result.push({ id: cat._id, label: prefix + cat.name });
    if (cat.children?.length) {
      result.push(...flattenCategories(cat.children, prefix + '  '));
    }
  }
  return result;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<{ categories: Category[] }>('/categories?tree=true');
      setCategories(data.categories);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/categories', {
        name: form.name.trim(),
        parentId: form.parentId || undefined,
        isActive: form.isActive,
      });
      toast.success('Category created successfully');
      setForm(EMPTY_FORM);
      setShowForm(false);
      setLoading(true);
      await fetchCategories();
    } catch {
      toast.error('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  }

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

  const flatOptions = flattenCategories(categories);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories and hierarchy"
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showForm ? 'Cancel' : '+ Add Category'}
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
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Parent Category</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">None (Top Level)</option>
                {flatOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cat-active"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border"
            />
            <label htmlFor="cat-active" className="text-sm font-medium">Active</label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      )}

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
