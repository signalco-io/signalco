import React, { useState } from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Input } from '@signalco/ui/dist/Input';
import { Button } from '@signalco/ui/dist/Button';
import useLocale from '../../../src/hooks/useLocale';
import ConfigurationDialog from './ConfigurationDialog';

export interface IConfirmDeleteDialogProps {
    isOpen: boolean,
    header: React.ReactNode,
    expectedConfirmText: string,
    onClose: () => void,
    onConfirm: () => void,
    maxWidth?: false | undefined | 'sm' | 'md' | 'lg' | 'xl',
}

function ConfirmDeleteDialog(props: IConfirmDeleteDialogProps) {
    const { isOpen, header, expectedConfirmText, onClose, onConfirm, maxWidth } = props;
    const { t } = useLocale('App', 'Dialogs');
    const [confirmText, setConfirmText] = useState('');

    return (
        <ConfigurationDialog
            header={header}
            isOpen={isOpen}
            onClose={onClose}
            maxWidth={maxWidth}>
            <Stack spacing={4}>
                <Typography>{t('ConfirmDeleteBody', { code: expectedConfirmText })}</Typography>
                <Input label={t('Confirm')} onChange={(e) => setConfirmText(e.target.value)} />
                <Button variant="solid" color="danger" disabled={confirmText !== expectedConfirmText} onClick={onConfirm}>
                    {`${t('ConfirmDeleteButton')} "${expectedConfirmText}"`}
                </Button>
            </Stack>
        </ConfigurationDialog>
    );
}

export default ConfirmDeleteDialog;
