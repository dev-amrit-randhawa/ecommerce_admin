'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface Banner {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  position: number;
  isActive: boolean;
}

interface BannerForm {
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
}

const EMPTY_FORM: BannerForm = { title: '', imageUrl: '', linkUrl: '', position: '0' };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = useCallback(async () => {
    try {
      const data = await api.get<{ data: Banner[] }>('/banners');
      setBanners(data.data || []);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast.error('Title and image URL are required');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/banners', {
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim(),
        linkUrl: form.linkUrl.trim() || undefined,
        position: parseInt(form.position, 10) || 0,
        isActive: true,
      });
      toast.success('Banner created successfully');
      setForm(EMPTY_FORM);
      setShowForm(false);
      setLoading(true);
      await fetchBanners();
    } catch {
      toast.error('Failed to create banner');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        description="Manage homepage and promotional banners"
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showForm ? 'Cancel' : '+ Add Banner'}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Banner title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Link URL</label>
              <input
                type="text"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="/collections/sale"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Position</label>
              <input
                type="number"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Banner'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="aspect-[16/6] animate-pulse rounded-md bg-muted" />
              <div className="mt-3 flex items-center justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))
        ) : banners.length === 0 ? (
          <div className="col-span-full rounded-lg border p-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">No banners found</p>
            <p className="mt-1 text-xs text-muted-foreground">Click &quot;+ Add Banner&quot; to create your first banner.</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="rounded-lg border p-4">
              <div className="aspect-[16/6] overflow-hidden rounded-md bg-muted">
                <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium">{banner.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
