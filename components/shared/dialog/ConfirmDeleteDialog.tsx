import React, { useState } from 'react';
import { Breakpoint, Button, Stack, TextField, Typography } from '@mui/material';
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
                <Button variant="contained" color="error" disabled={confirmText !== expectedConfirmText} onClick={onConfirm}>
                    {`${t('ConfirmDeleteButton')} "${expectedConfirmText}"`}
                </Button>
            </Stack>
        </ConfigurationDialog>
    );
}

export default ConfirmDeleteDialog;
