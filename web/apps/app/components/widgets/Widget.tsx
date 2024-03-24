
import React, { type ComponentType, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import IWidgetConfigurationOption from '../../src/widgets/IWidgetConfigurationOption';
import WidgetCard from './parts/WidgetCard';
const WidgetUnresolved = dynamic(() => import('./parts/WidgetUnresolved'));
const WidgetState = dynamic(() => import( './parts/WidgetState'));
const WidgetButton = dynamic(() => import('./parts/WidgetButton'));
const WidgetChecklist = dynamic(() => import('./parts/WidgetChecklist'));
const WidgetIndicator = dynamic(() => import('./parts/WidgetIndicator'));
const WidgetTime = dynamic(() => import('./parts/WidgetTime'));
const WidgetShades = dynamic(() => import('./parts/WidgetShades'));
const WidgetAirConditioning = dynamic(() => import('./parts/WidgetAirConditioning'));
const WidgetVacuum = dynamic(() => import('./parts/WidgetVacuum'));
const WidgetFinanceStock = dynamic(() => import('./parts/WidgetFinanceStock'));
const WidgetGraph = dynamic(() => import('./parts/WidgetGraph'));
const WidgetEnergy = dynamic(() => import('./parts/WidgetEnergy'));

export type widgetType = 'unknown' | 'button' | 'state' | 'vacuum' | 'shades' | 'indicator' | 'airconditioning' | 'termostat' | 'time' | 'checklist' | 'finance-stock' | 'graph' | 'energy';

export interface WidgetProps extends WidgetSpecifigProps {
    type: widgetType,
    onResize?: (rows: number, columns: number) => void,
    setConfig: (config: Record<string, unknown>) => void,
    onRemove: () => void
}

export interface WidgetSharedProps<TConfigurationProps> {
    id: string,
    isEditMode: boolean,
    config: TConfigurationProps | undefined,
    onOptions: (opts: IWidgetConfigurationOption<TConfigurationProps>[]) => void
}

export interface WidgetSpecifigProps {
    id: string,
    isEditMode: boolean,
    config: Record<string, unknown>,
}

function Widget(props: WidgetProps) {
    const [options, setOptions] = useState<IWidgetConfigurationOption<unknown>[] | undefined>(undefined);
    const handleOptions = useCallback((opts: IWidgetConfigurationOption<unknown>[]) => setOptions(opts), []);

    const widgetSharedProps = {
        id: props.id,
        isEditMode: props.isEditMode,
        config: props.config,
        onOptions: handleOptions
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let WidgetResolved: ComponentType<any> = WidgetUnresolved;
    if (props.type === 'state') {
        WidgetResolved = WidgetState;
    } else if (props.type === 'shades') {
        WidgetResolved = WidgetShades;
    } else if (props.type === 'vacuum') {
        WidgetResolved = WidgetVacuum;
    } else if (props.type === 'indicator') {
        WidgetResolved = WidgetIndicator;
    } else if (props.type === 'termostat') {
        WidgetResolved = WidgetAirConditioning;
    } else if (props.type === 'time') {
        WidgetResolved = WidgetTime;
    } else if (props.type === 'checklist') {
        WidgetResolved = WidgetChecklist;
    } else if (props.type === 'button') {
        WidgetResolved = WidgetButton;
    } else if (props.type === 'finance-stock') {
        WidgetResolved = WidgetFinanceStock;
    } else if (props.type === 'graph') {
        WidgetResolved = WidgetGraph;
    } else if (props.type === 'energy') {
        WidgetResolved = WidgetEnergy;
    }

    return (
        <WidgetCard
            isEditMode={props.isEditMode}
            onConfigured={props.setConfig}
            onRemove={props.onRemove}
            options={options}
            config={props.config}>
            <WidgetResolved {...widgetSharedProps} />
        </WidgetCard>
    );
}

export default Widget;
