import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Collaborator } from '#/features/collaborators/schemas';
import { FormCard } from '@/components/FormCard';
import { EditButton } from '@/components/EditButton';

type ViewCollaboratorCardProps = {
  collaborator: Collaborator;
  onCancel: () => void;
};

export function ViewCollaboratorCard({
  collaborator,
  onCancel,
}: ViewCollaboratorCardProps) {
  return (
    <FormCard
      onCancel={onCancel}
      title="View Collaborator"
      description="View collaborator record details."
      renderAction={
        <EditButton
          text="Edit"
          link={`/collaborators/${collaborator.collaboratorId}/edit`}
        />
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input value={collaborator.name} disabled />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input value={collaborator.email ?? ''} disabled />
        </Field>
        <Field>
          <FieldLabel>Withholding Percentage</FieldLabel>
          <Input value={`${collaborator.withholdingPercentage}%`} disabled />
        </Field>
      </FieldGroup>
    </FormCard>
  );
}
