import { PageHeader } from '@/components/layout/page-header';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Product" description={`Editing product ${id}`} />
      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">Product edit form will load here.</p>
      </div>
    </div>
  );
}
