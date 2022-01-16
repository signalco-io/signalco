
import { Alert } from "@mui/material";
import { observer } from "mobx-react-lite";
import dynamic from 'next/dynamic';
import React from "react";
import WidgetCard from "./parts/WidgetCard";
import WidgetChecklist from "./parts/WidgetChecklist";
const WidgetIndicator = dynamic(() => import("./parts/WidgetIndicator"));
const WidgetTime = dynamic(() => import("./parts/WidgetTime"));
const WidgetShades = dynamic(() => import("./parts/WidgetShades"));
const WidgetState = dynamic(() => import("./parts/WidgetState"));
const WidgetAirConditioning = dynamic(() => import("./parts/WidgetAirConditioning"));
const WidgetVacuum = dynamic(() => import("./parts/WidgetVacuum"));

export type widgetType = "state" | "vacuum" | "shades" | 'indicator' | "airconditioning" | "termostat" | "time" | "checklist";

export interface IWidgetProps extends IWidgetSharedProps {
    type: widgetType,
}

export interface IWidgetSharedProps {
    id: string,
    isEditMode: boolean,
    config: any,
    setConfig: (config: object) => void,
    onRemove: () => void
}

const UnresolvedWidget = (props: IWidgetSharedProps) => (
    <WidgetCard
        state={false}
        isEditMode={props.isEditMode}
        onRemove={props.onRemove}>
        <Alert severity="error" sx={{ height: "100%" }}>Unknown widget</Alert>
    </WidgetCard>
);

const Widget = (props: IWidgetProps) => {
    const widgetSharedProps = {
        id: props.id,
        isEditMode: props.isEditMode,
        config: props.config,
        setConfig: props.setConfig,
        onRemove: props.onRemove
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
        <WidgetResolved {...widgetSharedProps} />
    );
};

export default observer(Widget);