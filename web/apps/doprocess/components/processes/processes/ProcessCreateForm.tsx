'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { Add } from '@signalco/ui-icons';
import { KnownPages } from '../../../src/knownPages';
import { useProcessCreate } from '../../../src/hooks/useProcessCreate';

export function ProcessCreateForm({ redirect }: { redirect?: boolean }) {
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
                <Button
                title="Create tempalte"
                className="self-end"
                    loading={createProcess.isPending}
                    variant="solid"
                    startDecorator={<Add />}
                    onClick={handleProcessCreate}>
                    Create
            </Button>
        </Stack>
    );
}
