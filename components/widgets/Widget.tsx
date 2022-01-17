
import { Alert } from "@mui/material";
import { observer } from "mobx-react-lite";
import dynamic from 'next/dynamic';
import React, { useCallback, useState } from "react";
import IWidgetConfigurationOption from "../../src/widgets/IWidgetConfigurationOption";
import WidgetCard from "./parts/WidgetCard";
const WidgetChecklist = dynamic(() => import("./parts/WidgetChecklist"));
const WidgetIndicator = dynamic(() => import("./parts/WidgetIndicator"));
const WidgetTime = dynamic(() => import("./parts/WidgetTime"));
const WidgetShades = dynamic(() => import("./parts/WidgetShades"));
const WidgetState = dynamic(() => import("./parts/WidgetState"));
const WidgetAirConditioning = dynamic(() => import("./parts/WidgetAirConditioning"));
const WidgetVacuum = dynamic(() => import("./parts/WidgetVacuum"));

export type widgetType = "state" | "vacuum" | "shades" | 'indicator' | "airconditioning" | "termostat" | "time" | "checklist";

export interface IWidgetProps extends IWidgetSpecifigProps {
    type: widgetType,
    setConfig: (config: object) => void,
    onRemove: () => void
}

export interface IWidgetSharedProps {
    id: string,
    isEditMode: boolean,
    config: any,
    onOptions: (opts: IWidgetConfigurationOption[]) => void,
    onActive: (active: boolean) => void
}

export interface IWidgetSpecifigProps {
    id: string,
    isEditMode: boolean,
    config: any,
}

const UnresolvedWidget = () => (
    <Alert severity="error" sx={{ height: "100%" }}>Unknown widget</Alert>
);

const Widget = (props: IWidgetProps) => {
    const [options, setOptions] = useState<IWidgetConfigurationOption[] | undefined>(undefined);
    const [active, setActive] = useState(false);

    const handleOptions = useCallback((opts: IWidgetConfigurationOption[]) => setOptions(opts), []);
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
    if (props.type === "state") {
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
    }

    return (
        <WidgetCard
            state={active}
            isEditMode={props.isEditMode}
            onConfigured={props.setConfig}
            onRemove={props.onRemove}
            options={options}
            config={props.config}>
            <WidgetResolved {...widgetSharedProps} />
        </WidgetCard>
    );
};

export default observer(Widget);