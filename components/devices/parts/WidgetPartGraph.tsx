import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, XAxis, YAxis, Tooltip } from "recharts";
import { IDeviceTarget } from "../../../src/devices/Device";
import { rowHeight } from "./Shared";
import { scaleTime, timeHour } from 'd3';
import { useTheme } from "@mui/material";
import ReactTimeago from "react-timeago";
import { PinDropSharp } from "@mui/icons-material";

export interface IWidgetPartGraphConfig {
    columns: number,
    rows: number,
    value: () => Promise<IHistoricalValue[]>
    valueSource: IDeviceTarget,
    duration?: string,
    units?: string,
    type?: "step" | "basis"
}

export interface IHistoricalValue {
    timeStamp: Date;
    valueSerialized?: any;
}

const valueSerializedToFloat = (valueSerialized?: string) => {
    if (typeof valueSerialized === 'string') {
        if (valueSerialized.toLowerCase() === 'true') return 1;
        if (valueSerialized.toLowerCase() === 'false') return 0;
        return Number.parseFloat(valueSerialized);
    }
}

const useGraph = (value: () => Promise<IHistoricalValue[]>, duration?: string) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<any[]>([]);

    // TODO: Move to helper
    let durationMs = 24 * 60 * 60 * 1000;
    if (duration) {
        const durationRegex = /(\d*).*(\d\d):(\d\d):(\d\d)/i;
        const durationRegexMatch = duration.match(durationRegex);
        if (durationRegexMatch) {
            durationMs =
                (parseInt(durationRegexMatch[1], 10) || 0) * 24 * 60 * 60 * 1000 +
                (parseInt(durationRegexMatch[2], 10) || 0) * 60 * 60 * 1000 +
                (parseInt(durationRegexMatch[3], 10) || 0) * 60 * 1000 +
                (parseInt(durationRegexMatch[4], 10) || 0) * 1000;
        }
    }

    const now = new Date();
    const past = new Date();
    past.setTime(now.getTime() - durationMs);
    const domainGraph = scaleTime().domain([past, now]);
    const ticksHours = timeHour.every(1)!;
    const ticks = domainGraph.ticks(ticksHours).map(i => i.toString());

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await value();

                var mappedData = data.map(i => ({
                    timeStamp: domainGraph(new Date(i.timeStamp).getTime()),
                    value: valueSerializedToFloat(i.valueSerialized)
                }));

                setData(mappedData);
            } catch (err) {
                // TODO: Show error message
                console.warn('Failed to load history data', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return { isLoading, data, domain: domainGraph, ticks };
};

const WidgetPartGraph = ({ columnWidth, config }: { columnWidth: number, config: IWidgetPartGraphConfig }) => {
    const graph = useGraph(config.value, config.duration);
    const theme = useTheme();

    const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any }) => {
        if (active && payload && payload.length) {
            const dateTime = graph.domain.invert(payload[0].payload.timeStamp) as Date;
            return (
                <Paper sx={{ p: 2, px: 3, maxWidth: '180px' }} variant="outlined">
                    <Typography>{`${payload[0].value}${config.units || ''}`}</Typography>
                    <ReactTimeago date={dateTime} />
                    <Typography variant="caption" color="textSecondary" component="div">{`${dateTime.getFullYear()}-${dateTime.getMonth().toString().padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')} ${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`}</Typography>
                </Paper>
            );
        }

        return null;
    };

    return (
        <Box position="relative">
            <AreaChart
                width={columnWidth * config.columns}
                height={rowHeight * config.rows}
                data={graph.data}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis domain={[0, 1]} ticks={graph.ticks || []} hide dataKey="timeStamp" type="number" />
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type={config.type ?? "basis"}
                    dataKey="value"
                    fill={theme.palette.mode === "dark" ? "#ffffff" : "#000000"}
                    fillOpacity={0.1}
                    stroke="#aeaeae"
                    strokeWidth={2} />
            </AreaChart>
            {graph.isLoading &&
                <Box position="absolute" sx={{ top: '50%', left: 0, right: 0 }}>
                    <LinearProgress variant="indeterminate" />
                </Box>}
        </Box>
    );
}

export default WidgetPartGraph;