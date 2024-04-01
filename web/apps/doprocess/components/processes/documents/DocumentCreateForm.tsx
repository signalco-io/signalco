'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { Add } from '@signalco/ui-icons';
import { KnownPages } from '../../../src/knownPages';
import { useDocumentCreate } from '../../../src/hooks/useDocumentCreate';

export function DocumentCreateForm({ redirect }: { redirect: boolean; }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const createProcess = useDocumentCreate();

    const handleDocumentCreate = async () => {
        try {
            const response = await createProcess.mutateAsync({
                name,
            });
            if (redirect && response?.id)
                router.push(KnownPages.Document(response.id));
        } catch (error) {
            console.error(error);
            showNotification('Failed to create document', 'error');
        }
    };

    return (
        <Stack spacing={2}>
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
                placeholder="example: Onboarding manual" />
                <Button
                className="self-end"
                title="Create tempalte"
                    loading={createProcess.isPending}
                    variant="solid"
                    startDecorator={<Add />}
                    onClick={handleDocumentCreate}>
                    Create
            </Button>
        </Stack>
    );
}
