import React, { useState } from 'react';
import {
    bindMenu,
    bindTrigger,
    usePopupState,
} from 'material-ui-popup-state/hooks';
import { Box, Stack } from '@mui/system';
import { Button, ListItemDecorator, Menu, MenuItem, Sheet } from '@mui/joy';
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import { Delete, Settings } from '@mui/icons-material';
import useUserTheme from 'src/hooks/useUserTheme';
import WidgetConfiguration from './WidgetConfiguration';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { IsConfigurationValid } from '../../../src/widgets/ConfigurationValidator';

interface IWidgetCardProps {
    children: JSX.Element,
    state: boolean,
    isEditMode?: boolean
    config?: any,
    options?: IWidgetConfigurationOption[],
    onConfigured?: (config: any) => void
    onRemove?: () => void
}

function WidgetCard(props: IWidgetCardProps) {
    const {
        children,
        state,
        isEditMode,
        options,
        config,
        onConfigured,
        onRemove
    } = props;

    const themeContext = useUserTheme();

    const width = (config as any)?.columns || 2;
    const height = (config as any)?.rows || 2;
    const sizeWidth = width * 78 + (width - 1) * 8;
    const sizeHeight = height * 78 + (height - 1) * 8;

    const isLoading = typeof options === 'undefined';
    const needsConfiguration = typeof options === 'undefined' || options == null || !IsConfigurationValid(config, options);

    const popupState = usePopupState({ variant: 'popover', popupId: 'accountMenu' });

    const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
    const handleOnConfiguration = (newConfig: object) => {
        if (onConfigured) {
            onConfigured(newConfig);
        }
        setIsConfiguring(false);
    }

    const handleOnConfigureClicked = () => {
        setIsConfiguring(true);
        popupState.close();
    };

    const handleOnRemove = () => {
        popupState.close();
        if (onRemove) {
            onRemove();
        }
    }

    let bgColor;
    if (themeContext.isDark) {
        bgColor = state ? 'action.selected' : undefined;
    } else {
        bgColor = state ? 'background.default' : undefined
    }

    return (
        <>
            <Sheet
                sx={{
                    position: 'relative',
                    borderRadius: 8,
                    width: sizeWidth,
                    height: sizeHeight,
                    display: 'block',
                    bgcolor: bgColor
                }}
                variant="outlined">
                {(!isLoading && needsConfiguration) ? (
                    <Stack justifyContent="stretch" sx={{ height: '100%' }}>
                        <Button disabled={!isEditMode} size="lg" sx={{ height: '100%', fontSize: width < 2 ? '0.7em' : '1em' }} fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                    </Stack>
                ) : (<>{children}</>)}
                {isEditMode && (
                    <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <Button sx={{ minWidth: '42px' }}  {...bindTrigger(popupState)}><MoreHorizSharpIcon /></Button>
                    </Box>
                )}
            </Sheet>
            {options && <WidgetConfiguration onConfiguration={handleOnConfiguration} options={options} config={config} isOpen={isConfiguring} />}
            <Menu {...bindMenu(popupState)}>
                {options && (
                    <MenuItem onClick={handleOnConfigureClicked}>
                        <ListItemDecorator>
                            <Settings />
                        </ListItemDecorator>
                        Configure
                    </MenuItem>
                )}
                {onRemove && (
                    <MenuItem onClick={handleOnRemove}>
                        <ListItemDecorator>
                            <Delete />
                        </ListItemDecorator>
                        Remove
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}

export default WidgetCard;
