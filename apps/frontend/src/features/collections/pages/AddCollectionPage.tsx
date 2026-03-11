import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddCollection } from '#/features/collections/schemas';
import { useAddCollection } from '../stores/useCollections';
import { CollectionAddForm } from '../components/CollectionAddForm';

export function AddCollectionPage() {
  const navigate = useNavigate();
  const add = useAddCollection();

  const onSubmit: SubmitHandler<AddCollection> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Collection created successfully');
      navigate(`/collections/${result.collectionId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save collection'
      );
    }
  };

  return (
    <div className="space-y-4">
      <CollectionAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/collections')}
      />
    </div>
  );
}
