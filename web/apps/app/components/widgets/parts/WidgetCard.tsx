import React, { CSSProperties, useState } from 'react';
import dynamic from 'next/dynamic';
import { Stack } from '@signalco/ui-primitives/Stack';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { Card, CardOverflow } from '@signalco/ui-primitives/Card';
import { Button } from '@signalco/ui-primitives/Button';
import { Delete, MoreHorizontal, Settings } from '@signalco/ui-icons';
import { ErrorBoundary } from '@signalco/ui/ErrorBoundary';
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

export default function WidgetCard(props: IWidgetCardProps) {
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
            <Card className="relative h-[--widget-instance-h] w-[--widget-instance-w] overflow-hidden p-0"
                style={{
                    '--widget-instance-w': `calc(var(--widget-size)*${width}-${width}*2px)`,
                    '--widget-instance-h': `calc(var(--widget-size)*${height})`,
                } as CSSProperties}>
                    {(!isLoading && needsConfiguration) ? (
                        <Stack justifyContent="stretch" className="h-full">
                            <Button disabled={!isEditMode} size="lg" fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                        </Stack>
                    ) : (
                        <ErrorBoundary>{children}</ErrorBoundary>
                    )}
                    {isEditMode && (
                        <div className="absolute right-0 top-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button className="min-w-[42px]"><MoreHorizontal /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {options && (
                                        <DropdownMenuItem onSelect={handleOnConfigureClicked} startDecorator={<Settings />}>
                                            Configure
                                        </DropdownMenuItem>
                                    )}
                                    {onRemove && (
                                        <DropdownMenuItem onSelect={handleOnRemove} startDecorator={<Delete />}>
                                            Remove
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                )}
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
