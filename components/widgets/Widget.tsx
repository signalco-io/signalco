
import { Alert } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import WidgetCard from "./parts/WidgetCard";
import WidgetIndicator from "./parts/WidgetIndicator";
import WidgetShades from "./parts/WidgetShades";
import WidgetState from "./parts/WidgetState";
import WidgetTermostat from "./parts/WidgetTermostat";
import WidgetVacuum from "./parts/WidgetVacuum";

export type widgetType = "state" | "vacuum" | "shades" | 'indicator' | "termostat";

export interface IWidgetProps extends IWidgetSharedProps {
    type: widgetType,
}

export interface IWidgetSharedProps {
    isEditMode: boolean,
    config: any,
    setConfig: (config: object) => void,
    onRemove: () => void
}

const UnresolvedWidget = (props: IWidgetSharedProps) => (
    <WidgetCard width={props.config?.columns || 2} height={props.config?.rows || 1} state={false} needsConfiguration={false} isEditMode={props.isEditMode} onRemove={props.onRemove}>
        <Alert severity="error" sx={{ height: "100%" }}>Unknown widget</Alert>
    </WidgetCard>
);

const Widget = (props: IWidgetProps) => {
    const widgetSharedProps = {
        isEditMode: props.isEditMode,
        config: props.config,
        setConfig: props.setConfig,
        onRemove: props.onRemove
    };

    let WidgetResolved = UnresolvedWidget;
    if (props.type === "state") {
        WidgetResolved = WidgetState;
    } else if (props.type === 'shades') {
        WidgetResolved = WidgetShades;
    } else if (props.type === 'vacuum') {
        WidgetResolved = WidgetVacuum;
    } else if (props.type === 'indicator') {
        WidgetResolved = WidgetIndicator;
    } else if (props.type === 'termostat') {
        WidgetResolved = WidgetTermostat;
    }

    return (
        <WidgetResolved {...widgetSharedProps} />
    );
};

export default observer(Widget);