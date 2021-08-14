import { Alert, Grid, Paper } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import React from "react";
import ConductsService from "../../src/conducts/ConductsService";
import DevicesRepository from "../../src/devices/DevicesRepository";
import { rowHeight } from "./parts/Shared";
import WidgetPartButton, { IWidgetPartButtonConfig } from "./parts/WidgetPartButton";
import WidgetPartGraph, { IWidgetPartGraphConfig } from "./parts/WidgetPartGraph";
import WidgetPartInlineLabel, { IWidgetPartInlineLabelConfig } from "./parts/WidgetPartInlineLabel";

export interface IWidgetProps {
    isEditingDashboard?: boolean,
    isEditingWidget?: boolean,
    onEditConfirmed: () => void,
    parts: IWidgetPart[],
    columns: number,
    rows: number,
    columnWidth: number
}

export type widgetSize = "auto" | "grow" | "1/12" | "1/6" | "1/4" | "1/3" | "5/12" | "1/2" | "7/12" | "2/3" | "3/4" | "5/6" | "11/12" | "1";

export interface IWidgetPart {
    type: "inlineLabel" | "button" | "graph",
    config: IWidgetPartInlineLabelConfig | IWidgetPartButtonConfig | IWidgetPartGraphConfig,
    size: widgetSize,
    dense?: boolean
}

const resolveSize = (size: widgetSize) => {
    switch (size) {
        case "grow":
        case "auto": return "auto";
        case "1/12": return 1;
        case "1/6": return 2;
        case "1/4": return 3;
        case "1/3": return 4;
        case "5/12": return 5;
        case "1/2": return 6;
        case "7/12": return 7;
        case "2/3": return 8;
        case "3/4": return 9;
        case "5/6": return 10;
        case "11/12": return 11;
        case "1": return 12;
        default: return 12;
    }
}

const PartResolved = ({ columnWidth, part }: { columnWidth: number, part: IWidgetPart }) => {
    switch (part.type) {
        case "inlineLabel":
            var inlineLabelConfig = part.config as IWidgetPartInlineLabelConfig;
            if (inlineLabelConfig.valueSource != undefined) {
                inlineLabelConfig.value = new Promise(async resolve => {
                    if (inlineLabelConfig.valueSource != undefined) {
                        const device = await DevicesRepository.getDeviceAsync(inlineLabelConfig.valueSource.deviceId)
                        const state = device?.getState(inlineLabelConfig.valueSource);
                        resolve(state?.valueSerialized);
                    } else {
                        resolve('Invalid source');
                    }
                });
            }
            return <WidgetPartInlineLabel config={inlineLabelConfig} />
        case "button":
            var buttonConfig = part.config as IWidgetPartButtonConfig;
            if (buttonConfig.stateSource != undefined) {
                buttonConfig.state = new Promise(async resolve => {
                    if (buttonConfig.stateSource != undefined) {
                        const device = await DevicesRepository.getDeviceAsync(buttonConfig.stateSource.deviceId)
                        const state = device?.getState(buttonConfig.stateSource);

                        resolve(state);
                    } else {
                        console.debug("Failed to resolve button state because stateSource is not defined.");
                        resolve(null);
                    }
                });
            }

            if (buttonConfig.actionSource != undefined) {
                buttonConfig.action = async () => {
                    // Wrap in array if single object
                    let actions = [];
                    if (!Array.isArray(buttonConfig.actionSource)) {
                        actions.push(buttonConfig.actionSource);
                    } else {
                        actions.push(...buttonConfig.actionSource);
                    }

                    // Execute all actions
                    for (const action of actions) {
                        if (typeof action.deviceId === 'undefined' ||
                            typeof action.channelName === 'undefined' ||
                            typeof action.contactName === 'undefined') {
                            console.warn('Invalid button action source', action)
                            return;
                        }

                        const device = await DevicesRepository.getDeviceAsync(action.deviceId)

                        // Retrieve current boolean state
                        let newState = null;
                        if (typeof action.valueSerialized === 'undefined') {
                            const currentState = device?.getState(action);
                            if (typeof currentState === 'undefined') {
                                console.warn('Failed to retrieve button action source state', action)
                                return;
                            }

                            newState = typeof currentState === 'undefined'
                                ? action.valueSerialized
                                : !(`${currentState.valueSerialized}`.toLowerCase() === 'true');
                        } else {
                            newState = action.valueSerialized;
                        }

                        // Negate current state
                        await ConductsService.RequestConductAsync(action, newState, action.delay ?? 0);

                        // Set local value state
                        device?.updateState(
                            action.channelName,
                            action.contactName,
                            newState?.toString(),
                            new Date()
                        );
                    }
                };
            }
            return <WidgetPartButton config={part.config as IWidgetPartButtonConfig} />
        case "graph":
            const graphConfig = part.config as IWidgetPartGraphConfig;
            if (graphConfig.valueSource != undefined) {
                graphConfig.value = async () => {
                    if (typeof graphConfig.valueSource.deviceId === 'undefined' ||
                        typeof graphConfig.valueSource.channelName === 'undefined' ||
                        typeof graphConfig.valueSource.contactName === 'undefined') {
                        console.warn('Invalid graph value source', graphConfig.valueSource)
                        return [];
                    }

                    return await DevicesRepository.getDeviceStateHistoryAsync(graphConfig.valueSource, graphConfig.duration) ?? [];
                };
            }
            return <WidgetPartGraph columnWidth={columnWidth} config={graphConfig} />
        default:
            return <Alert severity="warning">Unkwnown widget part &apos;{part.type}&apos;</Alert>
    }
}

const Widget = (props: IWidgetProps) => {
    return (
        <Paper sx={{ width: props.columnWidth * props.columns, height: props.rows * rowHeight }}>
            <Grid container justifyContent="space-around" alignItems="center">
                {props.parts.map((p, index) => (
                    <Grid
                        key={index}
                        item
                        xs={resolveSize(p.size)}
                        sx={{ height: p.dense ? rowHeight / 2 : rowHeight, flexGrow: p.size === "grow" ? 1 : 0 }}
                        zeroMinWidth>
                        <PartResolved part={p} columnWidth={props.columnWidth} />
                    </Grid>))}
            </Grid>
        </Paper>
    )
};

export default observer(Widget);