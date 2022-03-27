import { Box } from "@mui/material";
import React from "react";
import { useSnackbar } from 'notistack';
import PageNotificationService from "../../src/notifications/PageNotificationService";
import { ChildrenProps } from "../../src/sharedTypes";

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
