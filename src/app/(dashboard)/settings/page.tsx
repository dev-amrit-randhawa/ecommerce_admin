'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/page-header';

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

  async function handleSave() {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success('Settings saved');
    } finally {
      setSaving(false);
    }
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
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Free Shipping Threshold</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                className="mt-1 w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Default Shipping Charge</label>
              <input
                type="number"
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
