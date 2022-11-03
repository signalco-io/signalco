import React, { useState } from 'react';
import {
    bindMenu,
    bindTrigger,
    usePopupState,
} from 'material-ui-popup-state/hooks';
import { Box, Stack } from '@mui/system';
import { Button, Card, CardOverflow, ListItemDecorator, Menu, MenuItem } from '@mui/joy';
import useUserTheme from 'src/hooks/useUserTheme';
import { Delete, MoreHorizontal, Settings } from 'components/shared/Icons';
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
        bgColor = state ? 'var(--joy-palette-background-surface)' : 'var(--joy-palette-background-body)';
    } else {
        bgColor = state ? undefined : 'var(--joy-palette-primary-100)'
    }

    return (
        <>
            <Card
                sx={{
                    width: sizeWidth,
                    height: sizeHeight,
                    backgroundColor: bgColor
                }}
                variant="outlined">
                <CardOverflow sx={{ p: 0 }}>
                    {(!isLoading && needsConfiguration) ? (
                        <Stack justifyContent="stretch" sx={{ height: '100%' }}>
                            <Button disabled={!isEditMode} size="lg" sx={{ height: '100%', fontSize: width < 2 ? '0.7em' : '1em' }} fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                        </Stack>
                    ) : (<>{children}</>)}
                    {isEditMode && (
                        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                            <Button sx={{ minWidth: '42px' }}  {...bindTrigger(popupState)}><MoreHorizontal /></Button>
                        </Box>
                    )}
                </CardOverflow>
            </Card>
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
