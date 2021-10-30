import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack } from "@mui/material";
import React, { useState } from "react";
import WidgetConfiguration, { IWidgetConfigurationOption } from "./WidgetConfiguration";
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import { Delete, Settings } from "@mui/icons-material";
import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from 'material-ui-popup-state/hooks';

interface IWidgetCardProps {
    children: JSX.Element,
    width: number,
    height: number,
    state: boolean,
    needsConfiguration?: boolean,
    isEditMode?: boolean
    config?: any,
    options?: IWidgetConfigurationOption[],
    onConfigured?: (config: any) => void
    onRemove?: () => void
}

const WidgetCard = (props: IWidgetCardProps) => {
    const {
        children,
        width,
        height,
        state,
        needsConfiguration,
        isEditMode,
        config,
        options,
        onConfigured,
        onRemove
    } = props;
    const sizeWidth = width * 78 + (width - 1) * 8;
    const sizeHeight = height * 78 + (height - 1) * 8;

    const popupState = usePopupState({ variant: 'popover', popupId: 'accountMenu' })

    const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
    const handleOnConfiguration = (config: object) => {
        if (onConfigured) {
            onConfigured(config);
        }
        setIsConfiguring(false);
    }

    const handleOnConfigureClicked = () => {
        setIsConfiguring(true);
    };

    return (
        <>
            <Paper sx={{ position: 'relative', borderRadius: 2, width: sizeWidth, height: sizeHeight, display: "block" }} variant="elevation" elevation={state ? 1 : 0}>
                {needsConfiguration ? (
                    <Stack justifyContent="stretch" sx={{ height: '100%' }}>
                        <Button size="large" sx={{ height: '100%' }} fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                    </Stack>
                ) : (<>{children}</>)}
                {isEditMode && (
                    <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <Button sx={{ minWidth: '42px' }}  {...bindTrigger(popupState)}><MoreHorizSharpIcon /></Button>
                    </Box>
                )}
            </Paper >
            {options && <WidgetConfiguration onConfiguration={handleOnConfiguration} options={options} config={config} isOpen={isConfiguring} />}
            <Menu {...bindMenu(popupState)}>
                {options && (
                    <MenuItem onClick={handleOnConfigureClicked}>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText>Configure</ListItemText>
                    </MenuItem>
                )}
                {onRemove && (
                    <MenuItem onClick={onRemove}>
                        <ListItemIcon>
                            <Delete />
                        </ListItemIcon>
                        <ListItemText>Remove</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}

export default WidgetCard;