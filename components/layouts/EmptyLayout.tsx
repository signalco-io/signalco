import React from 'react';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';
import { ChildrenProps } from '../../src/sharedTypes';
import PageNotificationService from '../../src/notifications/PageNotificationService';

export function EmptyLayout(props: ChildrenProps) {
    const {
        children
    } = props;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    PageNotificationService.setSnackbar(enqueueSnackbar, closeSnackbar);

    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            {children}
        </Box>
    );
}
