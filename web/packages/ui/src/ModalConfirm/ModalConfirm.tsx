import { ReactNode, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal, type ModalProps } from '@signalco/ui-primitives/Modal';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { useControllableState } from '@signalco/hooks/useControllableState';

export type ModalConfirmPromptProps = {
    header: ReactNode,
    promptLabel?: string,
    expectedConfirm: string,
    onConfirm?: () => void
};

export type ModalConfirmNoPromptProps = {
    header: ReactNode,
    promptLabel?: never,
    expectedConfirm?: never,
    onConfirm?: () => void
};

export type ModalConfirmProps = ModalProps & (ModalConfirmNoPromptProps | ModalConfirmPromptProps);

export function ModalConfirm({
    header, children, promptLabel, expectedConfirm, open, onOpenChange, onConfirm, ...rest
}: ModalConfirmProps) {
    const [isOpen, setIsOpen] = useControllableState(open, false, onOpenChange);
    const [confirmText, setConfirmText] = useState('');

    const handleConfirm = () => {
        setIsOpen(false);
        onConfirm?.();
    };

    const handleCancel = () => {
        setIsOpen(false);
    }

    return (
        <Modal open={isOpen} onOpenChange={setIsOpen} {...rest}>
            <Stack spacing={2}>
                <Row justifyContent="space-between">
                    <Typography level="h5">{header}</Typography>
                </Row>
                {children}
                {Boolean(expectedConfirm) && (
                    <Input value={confirmText} label={promptLabel} onChange={(e) => setConfirmText(e.target.value)} />
                )}
                <Row spacing={1} justifyContent="end">
                    <Button variant="plain" onClick={handleCancel}>Cancel</Button>
                    <Button variant="solid" onClick={handleConfirm} disabled={Boolean(expectedConfirm) && confirmText !== expectedConfirm}>Confirm</Button>
                </Row>
            </Stack>
        </Modal>
    );
}
