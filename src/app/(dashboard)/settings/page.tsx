'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/page-header';
import { api } from '@/lib/api/client';

interface SettingDoc {
  key: string;
  value: unknown;
  group: string;
}

interface SettingsForm {
  storeName: string;
  supportEmail: string;
  freeShippingThreshold: string;
  defaultShippingCharge: string;
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    storeName: 'Speffo',
    supportEmail: '',
    freeShippingThreshold: '',
    defaultShippingCharge: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SettingDoc[]>('/settings')
      .then((settings) => {
        const map: Record<string, unknown> = {};
        (Array.isArray(settings) ? settings : []).forEach((s) => {
          map[s.key] = s.value;
        });
        setForm({
          storeName: (map['store.name'] as string) || 'Speffo',
          supportEmail: (map['store.supportEmail'] as string) || '',
          freeShippingThreshold: map['shipping.freeThreshold'] != null ? String(map['shipping.freeThreshold']) : '',
          defaultShippingCharge: map['shipping.defaultCharge'] != null ? String(map['shipping.defaultCharge']) : '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/settings/bulk', {
        settings: [
          { key: 'store.name', value: form.storeName, group: 'general', description: 'Store display name' },
          { key: 'store.supportEmail', value: form.supportEmail, group: 'general', description: 'Customer support email' },
          { key: 'shipping.freeThreshold', value: Number(form.freeShippingThreshold) || 0, group: 'shipping', description: 'Order subtotal above which shipping is free (INR)' },
          { key: 'shipping.defaultCharge', value: Number(form.defaultShippingCharge) || 0, group: 'shipping', description: 'Default shipping charge (INR)' },
        ],
      });
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Configure store settings" />
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure store settings" />

      <div className="space-y-6">
        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">General</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <input
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Shipping</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders above the free shipping threshold will not be charged for delivery.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Free Shipping Threshold (INR)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 999"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Default Shipping Charge (INR)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 99"
                value={form.defaultShippingCharge}
                onChange={(e) => setForm({ ...form, defaultShippingCharge: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
