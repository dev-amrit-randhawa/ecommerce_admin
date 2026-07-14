'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: { desktop: string; mobile: string };
  link: string;
  position: string;
  priority: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'scheduled';
}

interface BannerForm {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  desktopImage: string;
  mobileImage: string;
  link: string;
  position: string;
  priority: string;
  startDate: string;
  endDate: string;
  status: string;
}

const POSITIONS = ['hero', 'promotional', 'sidebar', 'category'] as const;
const STATUSES = ['active', 'inactive', 'scheduled'] as const;

const EMPTY_FORM: BannerForm = {
  title: '',
  subtitle: '',
  description: '',
  ctaText: '',
  secondaryCtaText: '',
  secondaryCtaLink: '',
  desktopImage: '',
  mobileImage: '',
  link: '',
  position: 'hero',
  priority: '0',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  status: 'active',
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = useCallback(async () => {
    try {
      const data = await api.get<{ data: Banner[]; pagination: unknown }>('/banners/admin');
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

  async function uploadImage(
    file: File,
    setUploading: (v: boolean) => void,
    field: 'desktopImage' | 'mobileImage',
  ) {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'banners');
      const result = await api.upload<{ url: string; key: string }>('/uploads/image', formData);
      setForm((prev) => ({ ...prev, [field]: result.url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(banner: Banner) {
    setEditingId(banner._id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      ctaText: banner.ctaText || '',
      secondaryCtaText: banner.secondaryCtaText || '',
      secondaryCtaLink: banner.secondaryCtaLink || '',
      desktopImage: banner.image.desktop,
      mobileImage: banner.image.mobile,
      link: banner.link,
      position: banner.position,
      priority: String(banner.priority),
      startDate: banner.startDate?.slice(0, 10) || '',
      endDate: banner.endDate?.slice(0, 10) || '',
      status: banner.status,
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      setLoading(true);
      await fetchBanners();
    } catch {
      toast.error('Failed to delete banner');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.desktopImage || !form.mobileImage) {
      toast.error('Both desktop and mobile images are required');
      return;
    }
    if (!form.link.trim()) {
      toast.error('Link is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        description: form.description.trim() || undefined,
        ctaText: form.ctaText.trim() || undefined,
        secondaryCtaText: form.secondaryCtaText.trim() || undefined,
        secondaryCtaLink: form.secondaryCtaLink.trim() || undefined,
        image: {
          desktop: form.desktopImage,
          mobile: form.mobileImage,
        },
        link: form.link.trim(),
        position: form.position,
        priority: parseInt(form.priority, 10) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      };

      if (editingId) {
        await api.patch(`/banners/${editingId}`, payload);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', payload);
        toast.success('Banner created');
      }

      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      setLoading(true);
      await fetchBanners();
    } catch {
      toast.error(editingId ? 'Failed to update banner' : 'Failed to create banner');
    } finally {
      setSubmitting(false);
    }
  }

  function ImageUploadZone({
    label,
    imageUrl,
    uploading,
    inputRef,
    onFileChange,
    aspectHint,
  }: {
    label: string;
    imageUrl: string;
    uploading: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    aspectHint: string;
  }) {
    return (
      <div>
        <label className="text-sm font-medium">{label}</label>
        <div
          onClick={() => inputRef.current?.click()}
          className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-primary/50"
        >
          {imageUrl ? (
            <div className="w-full space-y-2">
              <img
                src={imageUrl}
                alt={label}
                className="h-32 w-full rounded-md object-cover"
              />
              <p className="text-center text-xs text-muted-foreground">Click to replace</p>
            </div>
          ) : uploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 py-4">
              <svg className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-xs font-medium text-muted-foreground">Click to upload</p>
              <p className="text-[11px] text-muted-foreground/70">{aspectHint}</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        description="Manage homepage and promotional banners"
        actions={
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm(EMPTY_FORM);
            }}
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
                placeholder="Summer Sale Banner"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Link</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="/collections/summer-sale"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Subtitle / Tag</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="THE NEW ARRIVALS"
            />
            <p className="mt-1 text-xs text-muted-foreground">Small eyebrow/tag line shown above the title.</p>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Supporting copy shown under the title."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">CTA Button Text</label>
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Shop New Arrivals"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Secondary CTA Text</label>
              <input
                type="text"
                value={form.secondaryCtaText}
                onChange={(e) => setForm({ ...form, secondaryCtaText: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Our Story"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Secondary CTA Link</label>
              <input
                type="text"
                value={form.secondaryCtaLink}
                onChange={(e) => setForm({ ...form, secondaryCtaLink: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="/brands"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ImageUploadZone
              label="Desktop Image (16:6 recommended)"
              imageUrl={form.desktopImage}
              uploading={uploadingDesktop}
              inputRef={desktopInputRef}
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file, setUploadingDesktop, 'desktopImage');
                e.target.value = '';
              }}
              aspectHint="1920×720 or 16:6 ratio"
            />
            <ImageUploadZone
              label="Mobile Image (1:1 or 4:5 recommended)"
              imageUrl={form.mobileImage}
              uploading={uploadingMobile}
              inputRef={mobileInputRef}
              onFileChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file, setUploadingMobile, 'mobileImage');
                e.target.value = '';
              }}
              aspectHint="800×1000 or 4:5 ratio"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Position</label>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="w-32">
            <label className="text-sm font-medium">Priority</label>
            <input
              type="number"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || uploadingDesktop || uploadingMobile}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : editingId ? 'Update Banner' : 'Create Banner'}
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
                <img src={banner.image.desktop} alt={banner.title} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{banner.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize">
                      {banner.position}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      banner.status === 'active' ? 'bg-green-100 text-green-800' :
                      banner.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
