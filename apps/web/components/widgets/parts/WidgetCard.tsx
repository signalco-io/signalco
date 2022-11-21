import React, { useState } from 'react';
import {
    bindMenu,
    bindTrigger,
    usePopupState,
} from 'material-ui-popup-state/hooks';
import { Delete, MoreHorizontal, Settings } from '@signalco/ui-icons';
import { Button, Card, CardOverflow, ListItemDecorator, Menu, MenuItem } from '@signalco/ui';
import { Box } from '@signalco/ui';
import { Stack } from '@mui/system';
import WidgetConfiguration from './WidgetConfiguration';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { IsConfigurationValid } from '../../../src/widgets/ConfigurationValidator';

interface IWidgetCardProps {
    children: JSX.Element,
    isEditMode?: boolean
    config?: any,
    options?: IWidgetConfigurationOption<any>[],
    onConfigured?: (config: any) => void
    onRemove?: () => void
}

function WidgetCard(props: IWidgetCardProps) {
    const {
        children,
        isEditMode,
        options,
        config,
        onConfigured,
        onRemove
    } = props;

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

    return (
        <>
            <Card
                sx={{
                    width: sizeWidth,
                    height: sizeHeight,
                    position: 'relative'
                }}
                variant="outlined">
                <CardOverflow sx={{
                    p: 0,
                    width: sizeWidth,
                    height: sizeHeight,
                }}>
                    {(!isLoading && needsConfiguration) ? (
                        <Stack justifyContent="stretch" sx={{ height: '100%' }}>
                            <Button disabled={!isEditMode} size="lg" sx={{ height: '100%', fontSize: width < 2 ? '0.7em' : '1em' }} fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                        </Stack>
                    ) : (
                        <>{children}</>
                    )}
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
