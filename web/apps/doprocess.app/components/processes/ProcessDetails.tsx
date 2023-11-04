'use client';

import { Stack } from '@signalco/ui/dist/Stack';
import { Skeleton } from '@signalco/ui/dist/Skeleton';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { ListHeader } from '../layouts/ListHeader';
import { useProcessTaskDefinitions } from '../../src/hooks/useProcessTaskDefinitions';
import { useProcess } from '../../src/hooks/useProcess';
import { TypographyProcessName } from './TypographyProcessName';
import TaskList from './tasks/TaskList';
import { ProcessRunCreateModal } from './ProcessRunCreateModal';
import { ListSkeleton } from '../shared/ListSkeleton';

type ProcessDetailsProps = {
    id: string;
    editable: boolean;
};

export function ProcessDetails({ id, editable }: ProcessDetailsProps) {
    const { data: process } = useProcess(id);
    const { data: taskDefinitions, isLoading: isLoadingTaskDefinitions, error: errorTaskDefinitions } = useProcessTaskDefinitions(id);

    return (
        <Stack spacing={2}>
            <Loadable
                isLoading={isLoadingTaskDefinitions}
                loadingLabel="Loading process details..."
                placeholder={<Skeleton className="h-7 w-[120px]" />}>
                <ListHeader
                    header={<TypographyProcessName id={id} level="h5" />}
                    actions={[
                        process && editable && <ProcessRunCreateModal process={process} />
                    ]} />
            </Loadable>
            <Loadable
                isLoading={isLoadingTaskDefinitions}
                loadingLabel="Loading task definitions..."
                placeholder={<ListSkeleton itemClassName="h-9 w-full" />}
                error={errorTaskDefinitions}>
                <TaskList
                    processId={id}
                    tasks={taskDefinitions?.map(td => ({ taskDefinition: td })) ?? []}
                    editable={editable} />
            </Loadable>
        </Stack>
    );
}
