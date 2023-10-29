'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Add, Play } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Modal } from '@signalco/ui/dist/Modal';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { Input } from '@signalco/ui/dist/Input';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Divider } from '@signalco/ui/dist/Divider';
import { Button } from '@signalco/ui/dist/Button';
import TaskList from '../TaskList';
import { ListHeader } from '../layouts/ListHeader';
import { Process } from '../../src/lib/db/schema';
import { KnownPages } from '../../src/knownPages';
import { useProcessTaskDefinitions } from './useProcessTaskDefinitions';
import { useProcessTaskDefinitionCreate } from './useProcessTaskDefinitionCreate';
import { useProcessRunCreate } from './useProcessRunCreate';
import { useProcess } from './useProcess';

function ProcessRunCreateForm({ process }: { process: Process }) {
    const { id: processId, name: processName } = process;

    const router = useRouter();
    const processRunCreate = useProcessRunCreate();
    const [name, setName] = useState(`${processName} - ${new Date().toLocaleString()} run`);

    const handleRunProcess = async () => {
        if (!name.length) {
            throw new Error('Name is required');
        }

        const result = await processRunCreate.mutateAsync({
            processId: processId.toString(),
            name
        });
        if (result?.id) {
            router.push(KnownPages.ProcessRun(processId, result.id));
        }
    };

    return (
        <Stack spacing={4}>
            <Input value={name} onChange={e => setName(e.target.value)} label="Name" />
            <Row justifyContent="end">
                <Button
                    onClick={handleRunProcess}
                    loading={processRunCreate.isPending}
                    variant="solid"
                    startDecorator={<Play />}>
                    Create run
                </Button>
            </Row>
        </Stack>
    );
}

function ProcessRunCreateModal({ process }: { process: Process }) {
    return (
        <Modal trigger={(
            <Tooltip title="Run process">
                <IconButton><Play /></IconButton>
            </Tooltip>
        )}>
            <Stack spacing={4}>
                <Stack spacing={2}>
                    <Row spacing={2}>
                        <Play />
                        <Typography level="h5">Run process</Typography>
                    </Row>
                    <Divider />
                </Stack>
                <ProcessRunCreateForm process={process} />
            </Stack>
        </Modal>
    );
}

export function ProcessDetails({ id }: { id: string; }) {
    const { data: process } = useProcess(id);
    const { data: taskDefinitions, isLoading: isLoadingTaskDefinitions, error: errorTaskDefinitions } = useProcessTaskDefinitions(id);
    const taskDefinitionCreate = useProcessTaskDefinitionCreate();

    const handleAddTaskDefinition = async () => {
        await taskDefinitionCreate.mutateAsync({
            processId: id
        });
    };

    return (
        <Stack className="p-2" spacing={2}>
            <ListHeader
                header={process?.name ?? ''}
                actions={[
                    process && <ProcessRunCreateModal process={process} />
                ]} />
            <Loadable isLoading={isLoadingTaskDefinitions} loadingLabel="Loading task definitions..." error={errorTaskDefinitions}>
                <TaskList tasks={taskDefinitions?.map(td => ({ taskDefinition: td })) ?? []} />
                <div className="flex flex-col items-center">
                    <IconButton onClick={handleAddTaskDefinition}>
                        <Add />
                    </IconButton>
                </div>
            </Loadable>
        </Stack>
    );
}
