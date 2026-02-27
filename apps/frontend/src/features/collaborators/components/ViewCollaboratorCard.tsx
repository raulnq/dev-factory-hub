import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Collaborator } from '#/features/collaborators/schemas';
import { ViewCardContent } from '@/components/ViewCardContent';

type ViewCollaboratorCardProps = {
  collaborator: Collaborator;
};

export function ViewCollaboratorCard({
  collaborator,
}: ViewCollaboratorCardProps) {
  return (
    <ViewCardContent>
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
    </ViewCardContent>
  );
}
