import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useTimesheetProjectsSuspense,
  useDeleteTimesheetProject,
  useEditWorklog,
} from '../stores/useTimesheets';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import type { TimesheetProjectWithWorklogs } from '#/features/timesheets/schemas';

type Props = {
  timesheetId: string;
  startDate: string;
  endDate: string;
  status: string;
};

export function TimesheetGrid({
  timesheetId,
  startDate,
  endDate,
  status,
}: Props) {
  const { data: projects } = useTimesheetProjectsSuspense(timesheetId);
  const deleteProject = useDeleteTimesheetProject(timesheetId);
  const editLog = useEditWorklog(timesheetId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<TimesheetProjectWithWorklogs | null>(null);

  const openDeleteDialog = (project: TimesheetProjectWithWorklogs) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const dates = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      result.push(d.toISOString().split('T')[0]);
    }
    return result;
  }, [startDate, endDate]);

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
      await deleteProject.mutateAsync(selectedProject.projectId);
      toast.success('Project removed successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove project'
      );
    }
  };

  const handleHoursChange = async (
    projectId: string,
    date: string,
    val: string
  ) => {
    const hours = Number(val);
    if (isNaN(hours) || hours < 0) return;
    try {
      await editLog.mutateAsync({ projectId, date, data: { hours } });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update hours'
      );
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSelectedProject(null);
    }
  };

  const isCompleted = status === 'Completed';

  const dailyTotals = dates.map(d => {
    return projects.reduce((acc, p) => {
      const log = p.worklogs.find((l: { date: string }) => l.date === d);
      return acc + (log?.hours || 0);
    }, 0);
  });

  const grandTotal = dailyTotals.reduce((acc, v) => acc + v, 0);

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-auto max-h-[600px] max-w-full block">
        <Table className="relative w-full border-collapse">
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            <TableRow>
              <TableHead className="min-w-[200px] bg-background sticky left-0 z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                Project
              </TableHead>
              {dates.map(d => (
                <TableHead key={d} className="text-center min-w-[100px]">
                  {new Date(d + 'T00:00:00').toLocaleDateString(undefined, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </TableHead>
              ))}
              <TableHead className="text-center font-bold min-w-[100px]">
                Total
              </TableHead>
              {!isCompleted && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map(p => {
              const rowTotal = p.worklogs.reduce(
                (acc: number, l: { hours: number }) => acc + l.hours,
                0
              );
              return (
                <TableRow key={p.projectId}>
                  <TableCell className="font-medium bg-background sticky left-0 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                    {p.projectName}
                  </TableCell>
                  {dates.map(d => {
                    const log = p.worklogs.find(
                      (l: { date: string }) => l.date === d
                    );
                    return (
                      <TableCell key={d} className="p-1">
                        <Input
                          type="number"
                          step="0.01"
                          defaultValue={log?.hours || 0}
                          onBlur={e =>
                            handleHoursChange(p.projectId, d, e.target.value)
                          }
                          disabled={isCompleted || editLog.isPending}
                          className="h-8 text-center"
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center font-bold">
                    {rowTotal.toFixed(2)}
                  </TableCell>
                  {!isCompleted && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(p)}
                        disabled={deleteProject.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter className="sticky bottom-0 bg-background z-10 shadow-[0_-1px_0_0_rgba(0,0,0,0.1)]">
            <TableRow>
              <TableCell className="font-bold bg-background sticky left-0 z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                Daily Total
              </TableCell>
              {dailyTotals.map((t, i) => (
                <TableCell key={i} className="text-center font-bold">
                  {t.toFixed(2)}
                </TableCell>
              ))}
              <TableCell className="text-center font-bold text-primary">
                {grandTotal.toFixed(2)}
              </TableCell>
              {!isCompleted && <TableCell></TableCell>}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <DeleteProjectDialog
        key={`${selectedProject?.projectId ?? 'new'}-project-delete`}
        name={selectedProject?.projectName}
        isOpen={deleteDialogOpen}
        isPending={deleteProject.isPending}
        onOpenChange={handleDeleteDialogChange}
        onDelete={handleDeleteProject}
      />
    </div>
  );
}
