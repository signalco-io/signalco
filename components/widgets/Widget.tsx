
import { Alert } from '@mui/material';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import { ObjectDictAny } from '../../src/sharedTypes';
import IWidgetConfigurationOption from '../../src/widgets/IWidgetConfigurationOption';
import WidgetCard from './parts/WidgetCard';
const WidgetChecklist = dynamic(() => import('./parts/WidgetChecklist'));
const WidgetIndicator = dynamic(() => import('./parts/WidgetIndicator'));
const WidgetTime = dynamic(() => import('./parts/WidgetTime'));
const WidgetShades = dynamic(() => import('./parts/WidgetShades'));
const WidgetState = dynamic(() => import('./parts/WidgetState'));
const WidgetAirConditioning = dynamic(() => import('./parts/WidgetAirConditioning'));
const WidgetVacuum = dynamic(() => import('./parts/WidgetVacuum'));
const WidgetButton = dynamic(() => import('./parts/WidgetButton'));

export type widgetType = 'button' | 'state' | 'vacuum' | 'shades' | 'indicator' | 'airconditioning' | 'termostat' | 'time' | 'checklist';

export interface WidgetProps extends WidgetSpecifigProps {
    type: widgetType,
    onResize?: (rows: number, columns: number) => void,
    setConfig: (config: object) => void,
    onRemove: () => void
}

export interface WidgetSharedProps {
    id: string,
    isEditMode: boolean,
    config: any,
    onOptions: (opts: IWidgetConfigurationOption[]) => void,
    onActive: (active: boolean) => void
}

export interface WidgetSpecifigProps {
    id: string,
    isEditMode: boolean,
    config: any,
}

function applyStaticToConfig(config: any | undefined, options: IWidgetConfigurationOption[] | undefined) {
    const staticConfigs: ObjectDictAny = {};
    if (options) {
        options.filter(o => o.type === 'static').forEach(o => {
            if (typeof staticConfigs[o.name] === 'undefined') {
                staticConfigs[o.name] = o.default;
            }
        });
    }

    return {
        ...staticConfigs,
        ...config
    };
}

const UnresolvedWidget = () => (
    <Alert severity="error" sx={{ height: '100%' }}>Unknown widget</Alert>
);

const Widget = (props: WidgetProps) => {
    const [config, setConfig] = useState(props.config);
    const [options, setOptions] = useState<IWidgetConfigurationOption[] | undefined>(undefined);
    const [active, setActive] = useState(false);

    useEffect(() => {
        // Apply static props, ignore if not changed
        const configWithStaticProps = applyStaticToConfig(props.config, options);
        if (JSON.stringify(configWithStaticProps) === JSON.stringify(config))
            return;

        setConfig(configWithStaticProps);
        if (props.onResize) {
            props.onResize(configWithStaticProps.rows || 2, configWithStaticProps.columns || 2);
        }
    }, [options, props, config]);

    const handleOptions = useCallback((opts: IWidgetConfigurationOption[]) => setOptions(opts), []);
    const handleAction = useCallback((newActive: boolean) => {
        if (active !== newActive) {
            return setActive(newActive);
        }
    }, [active]);

    const widgetSharedProps = {
        id: props.id,
        isEditMode: props.isEditMode,
        config: config,
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
    }

    return (
        <WidgetCard
            state={active}
            isEditMode={props.isEditMode}
            onConfigured={props.setConfig}
            onRemove={props.onRemove}
            options={options}
            config={config}>
            <WidgetResolved {...widgetSharedProps} />
        </WidgetCard>
    );
};

export default observer(Widget);
