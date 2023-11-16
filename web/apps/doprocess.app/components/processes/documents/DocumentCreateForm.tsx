'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Add } from '@signalco/ui-icons';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Stack } from '@signalco/ui/dist/Stack';
import { Input } from '@signalco/ui/dist/Input';
import { Button } from '@signalco/ui/dist/Button';
import { KnownPages } from '../../../src/knownPages';
import { useDocumentCreate } from '../../../src/hooks/useDocumentCreate';

export function DocumentCreateForm({ redirect }: { redirect: boolean; }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const createProcess = useDocumentCreate();

    const handleDocumentCreate = async () => {
        const response = await createProcess.mutateAsync({
            name,
        });
        if (redirect && response?.id)
            router.push(KnownPages.Document(response.id));
    };

    return (
        <Stack spacing={2}>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
                placeholder="example: Onboarding manual" />
            <Tooltip title="Create tempalte" className="self-end">
                <Button
                    loading={createProcess.isPending}
                    variant="solid"
                    startDecorator={<Add />}
                    onClick={handleDocumentCreate}>
                    Create
                </Button>
            </Tooltip>
        </Stack>
    );
}
