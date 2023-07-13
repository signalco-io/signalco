import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Delete, MoreHorizontal, Settings } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Menu, MenuItem } from '@signalco/ui/dist/Menu';
import { ErrorBoundary } from '@signalco/ui/dist/ErrorBoundary';
import { Card, CardOverflow } from '@signalco/ui/dist/Card';
import { Button } from '@signalco/ui/dist/Button';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { IsConfigurationValid } from '../../../src/widgets/ConfigurationValidator';

const WidgetConfiguration = dynamic(() => import('./WidgetConfiguration'));

interface IWidgetCardProps {
    children: JSX.Element,
    isEditMode?: boolean
    config: object,
    options?: IWidgetConfigurationOption<unknown>[],
    onConfigured?: (config: object) => void
    onRemove?: () => void
}

type CardConfig = {
    columns?: number;
    rows?: number;
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

    const width = (config as CardConfig)?.columns || 2;
    const height = (config as CardConfig)?.rows || 2;
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
                className="relative overflow-hidden"
                style={{
                    width: sizeWidth,
                    height: sizeHeight
                }}>
                <CardOverflow style={{
                    width: sizeWidth,
                    height: sizeHeight,
                }}>
                    {(!isLoading && needsConfiguration) ? (
                        <Stack justifyContent="stretch" style={{ height: '100%' }}>
                            <Button disabled={!isEditMode} size="lg" fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                        </Stack>
                    ) : (
                        <ErrorBoundary>{children}</ErrorBoundary>
                    )}
                    {isEditMode && (
                        <div style={{ position: 'absolute', top: 0, right: 0 }}>
                            <Menu trigger={(
                                <Button className="min-w-[42px]" {...props}><MoreHorizontal /></Button>
                            )}>
                                {options && (
                                    <MenuItem onClick={handleOnConfigureClicked} startDecorator={<Settings />}>
                                        Configure
                                    </MenuItem>
                                )}
                                {onRemove && (
                                    <MenuItem onClick={handleOnRemove} startDecorator={<Delete />}>
                                        Remove
                                    </MenuItem>
                                )}
                            </Menu>
                        </div>
                    )}
                </CardOverflow>
            </Card>
            {(isConfiguring && options) &&
                <WidgetConfiguration
                    onConfiguration={handleOnConfiguration}
                    options={options}
                    config={config}
                    isOpen={isConfiguring} />}
        </>
    );
}

export default WidgetCard;
