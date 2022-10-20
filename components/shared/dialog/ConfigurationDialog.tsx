import React from 'react';
import { Box, Breakpoint, Stack } from '@mui/system';
import { Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
import useIsTablet from 'src/hooks/useIsTablet';

export interface IConfigurationDialogProps {
    isOpen: boolean,
    title: React.ReactNode,
    titleActions?: React.ReactNode,
    onClose: () => void,
    children: React.ReactNode,
    maxWidth?: false | undefined | Breakpoint,
    actions?: React.ReactNode
}

function ConfigurationDialog(props: IConfigurationDialogProps) {
    const { children, title, titleActions, isOpen, onClose, maxWidth = 'sm', actions } = props;
    const isTablet = useIsTablet();

    return (
        <Modal open={isOpen} onClose={onClose}>
            <ModalDialog layout={isTablet ? 'fullscreen' : 'center'} sx={{
                width: '100%',
                maxWidth: maxWidth ? maxWidth : undefined
            }}>
                <ModalClose />
                <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography level="h5">{title}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: -1.5, mr: 4 }}>
                            {titleActions}
                        </Stack>
                    </Stack>
                        {children}
                    {actions && (
                        <Stack direction="row" spacing={1} justifyContent="end">
                            {actions}
                        </Stack>
                    )}
                </Stack>
            </ModalDialog>
        </Modal>
    );
}

export default ConfigurationDialog;
