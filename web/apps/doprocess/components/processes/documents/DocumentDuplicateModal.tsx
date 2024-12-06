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
import { useDocumentCreate } from '../../../src/hooks/useDocumentCreate';
import { DocumentDto } from '../../../app/api/dtos/dtos';

type DocumentDuplicateModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: DocumentDto;
};

export function DocumentDuplicateModal({
    open, onOpenChange, document
}: DocumentDuplicateModalProps) {
    const router = useRouter();
    const [name, setName] = useState(document.name + ' (copy)');
    const documentCreate = useDocumentCreate();

    const handleDuplicate = async () => {
        const response = await documentCreate.mutateAsync({
            name,
            basedOn: document.id
        });
        if (response?.id) {
            onOpenChange(false);
            router.push(KnownPages.Document(response.id));
        }
    };

    return (
        <Modal title="Duplicate document" open={open} onOpenChange={onOpenChange}>
            <Stack spacing={2}>
                <Row spacing={2}>
                    <Duplicate />
                    <Typography level="h5">Duplicate document</Typography>
                </Row>
                <Typography level="body2">
                    This will create a new document with the same name and content.
                </Typography>
                <Typography level="body2">
                    You can edit the new document after it is created.
                </Typography>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Name"
                    placeholder="example: Onboarding manual" />
                <Row justifyContent="end" spacing={1}>
                    <Button variant="plain" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button variant="solid" onClick={handleDuplicate}>Duplicate</Button>
                </Row>
            </Stack>
        </Modal>
    );
}
