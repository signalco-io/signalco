'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal } from '@signalco/ui-primitives/Modal';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { Duplicate } from '@signalco/ui-icons';
import { KnownPages } from '../../../src/knownPages';
import { useProcessCreate } from '../../../src/hooks/useProcessCreate';
import { ProcessDto } from '../../../app/api/dtos/dtos';

type ProcessDuplicateModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    process: ProcessDto;
};

// TODO: We have similar modals for documents and processes. Consider refactoring to a shared component.
export function ProcessDuplicateModal({
    open, onOpenChange, process
}: ProcessDuplicateModalProps) {
    const router = useRouter();
    const [name, setName] = useState(process.name + ' (copy)');
    const processCreate = useProcessCreate();

    const handleDuplicate = async () => {
        const response = await processCreate.mutateAsync({
            name,
            basedOn: process.id
        });
        if (response?.id) {
            onOpenChange(false);
            router.push(KnownPages.Process(response.id));
        }
    };

    return (
        <Modal title="Duplicate process" open={open} onOpenChange={onOpenChange}>
            <Stack spacing={2}>
                <Row spacing={2}>
                    <Duplicate />
                    <Typography level="h5">Duplicate process</Typography>
                </Row>
                <Typography level="body2">
                    This will create a new process with the same name and tasks.
                </Typography>
                <Typography level="body2">
                    You can edit the new process after it is created.
                </Typography>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Name"
                    placeholder="example: Onboarding process" />
                <Row justifyContent="end" spacing={1}>
                    <Button variant="plain" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="solid" onClick={handleDuplicate}>Duplicate</Button>
                </Row>
            </Stack>
        </Modal>
    );
}
