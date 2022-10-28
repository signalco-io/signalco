import React, { useState } from 'react';
import { Breakpoint, Stack } from '@mui/system';
import { Button, TextField, Typography } from '@mui/joy';
import ConfigurationDialog from './ConfigurationDialog';
import useLocale from '../../../src/hooks/useLocale';

export interface IConfirmDeleteDialogProps {
    isOpen: boolean,
    title: React.ReactNode,
    expectedConfirmText: string,
    onClose: () => void,
    onConfirm: () => void,
    maxWidth?: false | undefined | Breakpoint,
}

function ConfirmDeleteDialog(props: IConfirmDeleteDialogProps) {
    const { isOpen, title, expectedConfirmText, onClose, onConfirm, maxWidth } = props;
    const { t } = useLocale('App', 'Dialogs');
    const [confirmText, setConfirmText] = useState('');

    return (
        <ConfigurationDialog
            title={title}
            isOpen={isOpen}
            onClose={onClose}
            maxWidth={maxWidth}>
            <Stack spacing={4}>
                <Typography>{t('ConfirmDeleteBody', { code: expectedConfirmText })}</Typography>
                <TextField label={t('Confirm')} onChange={(e) => setConfirmText(e.target.value)} />
                <Button variant="solid" color="danger" disabled={confirmText !== expectedConfirmText} onClick={onConfirm}>
                    {`${t('ConfirmDeleteButton')} "${expectedConfirmText}"`}
                </Button>
            </Stack>
        </ConfigurationDialog>
    );
}

export default ConfirmDeleteDialog;
