'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Input } from '@signalco/ui/dist/Input';
import { Button } from '@signalco/ui/dist/Button';
import { Process } from '../../src/lib/db/schema';
import { KnownPages } from '../../src/knownPages';
import { useProcessRunCreate } from './useProcessRunCreate';

export function ProcessRunCreateForm({ process }: { process: Process; }) {
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
                    Run process
                </Button>
            </Row>
        </Stack>
    );
}
