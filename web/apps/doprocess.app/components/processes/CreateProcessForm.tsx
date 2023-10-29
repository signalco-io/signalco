'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Add } from '@signalco/ui-icons';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Stack } from '@signalco/ui/dist/Stack';
import { Input } from '@signalco/ui/dist/Input';
import { Button } from '@signalco/ui/dist/Button';
import { KnownPages } from '../../src/knownPages';
import { useProcessCreate } from './useProcessCreate';

export function CreateProcessForm({ redirect }: { redirect?: boolean }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const createProcess = useProcessCreate();

    const handleProcessCreate = async () => {
        const response = await createProcess.mutateAsync({
            name,
        });
        if (redirect && response?.id)
            router.push(KnownPages.Process(response.id))
    };

    return (
        <Stack spacing={2}>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
                placeholder="example: Onboarding process" />
            <Tooltip title="Create tempalte">
                <Button
                    loading={createProcess.isPending}
                    variant="soft"
                    startDecorator={<Add />}
                    className="self-end"
                    onClick={handleProcessCreate}>
                    Create
                </Button>
            </Tooltip>
        </Stack>
    );
}
