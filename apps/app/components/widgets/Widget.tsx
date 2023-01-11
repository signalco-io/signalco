
import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Alert } from '@signalco/ui';
import WidgetState from './parts/WidgetState';
import WidgetCard from './parts/WidgetCard';
import WidgetButton from './parts/WidgetButton';
import IWidgetConfigurationOption from '../../src/widgets/IWidgetConfigurationOption';
const WidgetChecklist = dynamic(() => import('./parts/WidgetChecklist'));
const WidgetIndicator = dynamic(() => import('./parts/WidgetIndicator'));
const WidgetTime = dynamic(() => import('./parts/WidgetTime'));
const WidgetShades = dynamic(() => import('./parts/WidgetShades'));
const WidgetAirConditioning = dynamic(() => import('./parts/WidgetAirConditioning'));
const WidgetVacuum = dynamic(() => import('./parts/WidgetVacuum'));
const WidgetFinanceStock = dynamic(() => import('./parts/WidgetFinanceStock'));
const WidgetGraph = dynamic(() => import('./parts/WidgetGraph'));

export type widgetType = 'button' | 'state' | 'vacuum' | 'shades' | 'indicator' | 'airconditioning' | 'termostat' | 'time' | 'checklist' | 'finance-stock' | 'graph';

export interface WidgetProps extends WidgetSpecifigProps {
    type: widgetType,
    onResize?: (rows: number, columns: number) => void,
    setConfig: (config: object) => void,
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
    config: any,
}

function UnresolvedWidget() {
    return <Alert color="danger" sx={{ height: '100%' }}>Unknown widget</Alert>
}

function Widget(props: WidgetProps) {
    const [options, setOptions] = useState<IWidgetConfigurationOption<any>[] | undefined>(undefined);
    const [active, setActive] = useState(false);

    const handleOptions = useCallback((opts: IWidgetConfigurationOption<any>[]) => setOptions(opts), []);
    const handleAction = useCallback((newActive: boolean) => {
        if (active !== newActive) {
            return setActive(newActive);
        }
    }, [active]);

    const widgetSharedProps = {
        id: props.id,
        isEditMode: props.isEditMode,
        config: props.config,
        onOptions: handleOptions,
        onActive: handleAction
    };

    let WidgetResolved: React.ComponentType<any> | React.ReactElement | null | undefined = UnresolvedWidget;
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
