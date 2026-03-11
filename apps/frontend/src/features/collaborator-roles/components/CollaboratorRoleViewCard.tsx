import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { CollaboratorRole } from '#/features/collaborator-roles/schemas';
import { FormCard } from '@/components/FormCard';
import { EditButton } from '@/components/EditButton';

type CollaboratorRoleViewCardProps = {
  collaboratorRole: CollaboratorRole;
  onCancel: () => void;
};

export function CollaboratorRoleViewCard({
  collaboratorRole,
  onCancel,
}: CollaboratorRoleViewCardProps) {
  return (
    <FormCard
      onCancel={onCancel}
      title="View Collaborator Role"
      description="View collaborator role record details."
      renderAction={
        <EditButton
          text="Edit"
          link={`/collaborator-roles/${collaboratorRole.collaboratorRoleId}/edit`}
        />
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input value={collaboratorRole.name} disabled />
        </Field>
        <Field>
          <FieldLabel>Currency</FieldLabel>
          <Input value={collaboratorRole.currency} disabled />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Fee Rate</FieldLabel>
            <Input value={collaboratorRole.feeRate.toString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Cost Rate</FieldLabel>
            <Input value={collaboratorRole.costRate.toString()} disabled />
          </Field>
        </div>
      </FieldGroup>
    </FormCard>
  );
}
