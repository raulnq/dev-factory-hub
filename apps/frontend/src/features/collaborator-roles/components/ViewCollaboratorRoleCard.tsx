import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { CollaboratorRole } from '#/features/collaborator-roles/schemas';
import { ViewCardContent } from '@/components/ViewCardContent';

type ViewCollaboratorRoleCardProps = {
  collaboratorRole: CollaboratorRole;
};

export function ViewCollaboratorRoleCard({
  collaboratorRole,
}: ViewCollaboratorRoleCardProps) {
  return (
    <ViewCardContent>
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
    </ViewCardContent>
  );
}
