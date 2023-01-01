import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Delete, MoreHorizontal, Settings } from '@signalco/ui-icons';
import { Stack, Button, Card, CardOverflow, ListItemDecorator, Menu, MenuItem, Box } from '@signalco/ui';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { IsConfigurationValid } from '../../../src/widgets/ConfigurationValidator';

const WidgetConfiguration = dynamic(() => import('./WidgetConfiguration'));
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

    const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
    const handleOnConfiguration = (newConfig: object) => {
        if (onConfigured) {
            onConfigured(newConfig);
        }
        setIsConfiguring(false);
    }

    const handleOnConfigureClicked = () => {
        setIsConfiguring(true);
    };

    const handleOnRemove = () => {
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
                    position: 'relative',
                    overflow: 'hidden'
                }}
                variant="outlined">
                <CardOverflow sx={{
                    p: 0,
                    width: sizeWidth,
                    height: sizeHeight,
                }}>
                    {(!isLoading && needsConfiguration) ? (
                        <Stack justifyContent="stretch" style={{ height: '100%' }}>
                            <Button disabled={!isEditMode} size="lg" sx={{ height: '100%', fontSize: width < 2 ? '0.7em' : '1em' }} fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                        </Stack>
                    ) : (
                        <>{children}</>
                    )}
                    {isEditMode && (
                        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                            <Menu menuId="widget-config" renderTrigger={(props: any) => (
                                <Button sx={{ minWidth: '42px' }}  {...props}><MoreHorizontal /></Button>
                            )}>
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
                        </Box>
                    )}
                </CardOverflow>
            </Card>
            {(isConfiguring && options) && <WidgetConfiguration
                onConfiguration={handleOnConfiguration}
                options={options}
                config={config}
                isOpen={isConfiguring} />}
        </>
    );
}

export default WidgetCard;
