import React, { useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import useLocale from '../../../src/hooks/useLocale';
import ConfigurationDialog from './ConfigurationDialog';

export interface IConfirmDeleteDialogProps {
    isOpen: boolean,
    header: React.ReactNode,
    expectedConfirmText: string,
    onClose: () => void,
    onConfirm: () => void,
}

function ConfirmDeleteDialog(props: IConfirmDeleteDialogProps) {
    const { isOpen, header, expectedConfirmText, onClose, onConfirm } = props;
    const { t } = useLocale('App', 'Dialogs');
    const [confirmText, setConfirmText] = useState('');

    return (
        <ConfigurationDialog
            header={header}
            open={isOpen}
            onClose={onClose}>
            <Stack spacing={4}>
                <Typography>{t('ConfirmDeleteBody', { code: expectedConfirmText })}</Typography>
                <Input label={t('Confirm')} onChange={(e) => setConfirmText(e.target.value)} />
                <Button
                    variant="solid"
                    className="bg-red-700 text-destructive-foreground hover:bg-red-700/90"
                    disabled={confirmText !== expectedConfirmText}
                    onClick={onConfirm}>
                    {`${t('ConfirmDeleteButton')} "${expectedConfirmText}"`}
                </Button>
            </Stack>
        </ConfigurationDialog>
    );
}

export default ConfirmDeleteDialog;
