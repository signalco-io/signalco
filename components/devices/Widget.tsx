
import { Alert } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
// import ConductsService from "../../src/conducts/ConductsService";
// import DevicesRepository from "../../src/devices/DevicesRepository";
import WidgetCard from "./parts/WidgetCard";
import { IWidgetPartButtonConfig } from "./parts/WidgetPartButton";
import { IWidgetPartGraphConfig } from "./parts/WidgetPartGraph";
import { IWidgetPartInlineLabelConfig } from "./parts/WidgetPartInlineLabel";
import WidgetShades from "./parts/WidgetShades";
import WidgetState from "./parts/WidgetState";
import WidgetVacuum from "./parts/WidgetVacuum";

export type widgetType = "state" | "vacuum" | "shades";

export interface IWidgetProps {
    isEditMode: boolean,
    type: widgetType,
    config?: object,
    setConfig: (config: object) => Promise<void>,
    onRemove: () => void
}

export type widgetSize = "auto" | "grow" | "1/12" | "1/6" | "1/4" | "1/3" | "5/12" | "1/2" | "7/12" | "2/3" | "3/4" | "5/6" | "11/12" | "1";

export interface IWidgetPart {
    type: "inlineLabel" | "button" | "graph",
    config: IWidgetPartInlineLabelConfig | IWidgetPartButtonConfig | IWidgetPartGraphConfig,
    size: widgetSize,
    dense?: boolean
}

// const resolveSize = (size: widgetSize) => {
//     switch (size) {
//         case "grow":
//         case "auto": return "auto";
//         case "1/12": return 1;
//         case "1/6": return 2;
//         case "1/4": return 3;
//         case "1/3": return 4;
//         case "5/12": return 5;
//         case "1/2": return 6;
//         case "7/12": return 7;
//         case "2/3": return 8;
//         case "3/4": return 9;
//         case "5/6": return 10;
//         case "11/12": return 11;
//         case "1": return 12;
//         default: return 12;
//     }
// }

// const PartResolved = ({ columnWidth, part }: { columnWidth: number, part: IWidgetPart }) => {
//     switch (part.type) {
//         case "inlineLabel":
//             var inlineLabelConfig = part.config as IWidgetPartInlineLabelConfig;
//             if (inlineLabelConfig.valueSource != undefined) {
//                 inlineLabelConfig.value = new Promise(async resolve => {
//                     if (inlineLabelConfig.valueSource != undefined) {
//                         const device = await DevicesRepository.getDeviceAsync(inlineLabelConfig.valueSource.deviceId)
//                         const state = device?.getState(inlineLabelConfig.valueSource);
//                         resolve(state?.valueSerialized);
//                     } else {
//                         resolve('Invalid source');
//                     }
//                 });
//             }
//             return <WidgetPartInlineLabel config={inlineLabelConfig} />
//         case "button":
//             var buttonConfig = part.config as IWidgetPartButtonConfig;
//             if (buttonConfig.stateSource != undefined) {
//                 buttonConfig.state = new Promise(async resolve => {
//                     if (buttonConfig.stateSource != undefined) {
//                         const device = await DevicesRepository.getDeviceAsync(buttonConfig.stateSource.deviceId)
//                         const state = device?.getState(buttonConfig.stateSource);

//                         resolve(state);
//                     } else {
//                         console.debug("Failed to resolve button state because stateSource is not defined.");
//                         resolve(null);
//                     }
//                 });
//             }

//             if (buttonConfig.actionSource != undefined) {
//                 buttonConfig.action = async () => {
//                     // Wrap in array if single object
//                     let actions = [];
//                     if (!Array.isArray(buttonConfig.actionSource)) {
//                         actions.push(buttonConfig.actionSource);
//                     } else {
//                         actions.push(...buttonConfig.actionSource);
//                     }

//                     // Execute all actions
//                     const conducts = [];
//                     for (const action of actions) {
//                         if (typeof action.deviceId === 'undefined' ||
//                             typeof action.channelName === 'undefined' ||
//                             typeof action.contactName === 'undefined') {
//                             console.warn('Invalid button action source', action)
//                             return;
//                         }

//                         const device = await DevicesRepository.getDeviceAsync(action.deviceId)

//                         const isAction = device
//                             ?.getContact({ channelName: action.channelName, deviceId: device.id, contactName: action.contactName })
//                             ?.dataType === 'action' ?? false;

//                         // Retrieve current boolean state
//                         let newState = null;
//                         if (typeof action.valueSerialized === 'undefined') {
//                             if (!isAction) {
//                                 const currentState = device?.getState(action);
//                                 if (typeof currentState === 'undefined') {
//                                     console.warn('Failed to retrieve button action source state', action)
//                                     return;
//                                 }

//                                 newState = typeof currentState === 'undefined'
//                                     ? action.valueSerialized
//                                     : !(`${currentState.valueSerialized}`.toLowerCase() === 'true');
//                             }
//                         } else {
//                             newState = action.valueSerialized;
//                         }

//                         conducts.push({ target: action, value: newState, delay: action.delay ?? 0, device: device });
//                     }

//                     // Negate current state
//                     await ConductsService.RequestMultipleConductAsync(conducts);

//                     // Set local value state
//                     conducts.forEach(conduct => {
//                         conduct.device?.updateState(
//                             conduct.target.channelName,
//                             conduct.target.contactName,
//                             conduct.value?.toString(),
//                             new Date()
//                         );
//                     });
//                 };
//             }
//             return <WidgetPartButton config={part.config as IWidgetPartButtonConfig} />
//         case "graph":
//             const graphConfig = part.config as IWidgetPartGraphConfig;
//             if (graphConfig.valueSource != undefined) {
//                 graphConfig.value = async () => {
//                     if (typeof graphConfig.valueSource.deviceId === 'undefined' ||
//                         typeof graphConfig.valueSource.channelName === 'undefined' ||
//                         typeof graphConfig.valueSource.contactName === 'undefined') {
//                         console.warn('Invalid graph value source', graphConfig.valueSource)
//                         return [];
//                     }

//                     return (await DevicesRepository.getDeviceStateHistoryAsync(graphConfig.valueSource, graphConfig.duration)) ?? [];
//                 };
//             }
//             return <WidgetPartGraph columnWidth={columnWidth} config={graphConfig} />
//         default:
//             return <Alert severity="warning">Unkwnown widget part &apos;{part.type}&apos;</Alert>
//     }
// }

interface IWidgetSharedProps {
    isEditMode: boolean,
    config: any,
    setConfig: (config: object) => Promise<void>,
    onRemove: () => void
}

const UnresolvedWidget = (props: IWidgetSharedProps) => (
    <WidgetCard width={2} height={1} state={false} needsConfiguration={false} isEditMode={props.isEditMode} onRemove={props.onRemove}>
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
    }

    return (
        <WidgetResolved {...widgetSharedProps} />
    );
};

export default observer(Widget);