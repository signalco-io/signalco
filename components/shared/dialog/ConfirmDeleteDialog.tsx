import { Breakpoint, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import ConfigurationDialog from './ConfigurationDialog';

export interface IConfirmDeleteDialogProps {
    isOpen: boolean,
    title: React.ReactNode,
    expectedConfirmText: string,
    onClose: () => void,
    onConfirm: () => void,
    maxWidth?: false | undefined | Breakpoint,
}

const ConfirmDeleteDialog = (props: IConfirmDeleteDialogProps) => {
    const { isOpen, title, expectedConfirmText, onClose, onConfirm, maxWidth } = props;
    const [confirmText, setConfirmText] = useState('');

    return (
        <ConfigurationDialog
            title={title}
            isOpen={isOpen}
            onClose={onClose}
            maxWidth={maxWidth}>
            <Stack spacing={4}>
                <Typography>Deleted item can not be restored. Please confirm you are deleting correct item by entering &quot;<code>{expectedConfirmText}</code>&quot; bellow.</Typography>
                <TextField label="Confirm" onChange={(e) => setConfirmText(e.target.value)} />
                <Button variant="contained" color="error" disabled={confirmText !== expectedConfirmText} onClick={onConfirm}>
                    Delete &quot;{expectedConfirmText}&quot;
                </Button>
            </Stack>
        </ConfigurationDialog>
    );
};

export default ConfirmDeleteDialog;