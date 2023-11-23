'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { Play } from '@signalco/ui-icons';
import { KnownPages } from '../../../src/knownPages';
import { useProcessRunCreate } from '../../../src/hooks/useProcessRunCreate';
import { useProcess } from '../../../src/hooks/useProcess';

export function ProcessRunCreateForm({ processId, redirect }: { processId: string, redirect?: boolean }) {
    const { data: process } = useProcess(processId);

    const router = useRouter();
    const processRunCreate = useProcessRunCreate();
    const [name, setName] = useState(`${process?.name} - ${new Date().toLocaleString()} run`);

    useEffect(() => {
        setName(`${process?.name} - ${new Date().toLocaleString()} run`);
    }, [process?.name]);

    const handleRunProcess = async () => {
        if (!name.length) {
            throw new Error('Name is required');
        }

        const result = await processRunCreate.mutateAsync({
            processId: processId.toString(),
            name
        });
        if (redirect && result?.id) {
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
