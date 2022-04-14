import { Box, Paper, Stack, Typography } from "@mui/material";
import { deepOrange, lightBlue } from "@mui/material/colors";
import { ScaleTime, scaleTime, timeHour } from "d3";
import { useContext } from "react";
import ReactTimeago from "react-timeago";
import { Area, Bar, BarChart, ComposedChart, LabelList, Line, Tooltip, XAxis, YAxis } from "recharts";
import { AppContext } from "../../pages/_app";
import { arrayMax, arrayMin } from "../../src/helpers/ArrayHelpers";
import useLocale from "../../src/hooks/useLocale";
import DateTimeProvider from "../../src/services/DateTimeProvider";
import { ObjectDictAny } from "../../src/sharedTypes";
import NoDataPlaceholder from "../shared/indicators/NoDataPlaceholder";

export interface IGraphProps {
    label?: string;
    data: { id: string, value: string }[];
    durationMs: number;
    width: number;
    height: number;
    startDateTime?: Date;
}

const renderCustomizedTimeLineLabel = (props: any) => {
    const { x, y, width, value } = props;
    const radius = 10;

    if (width > 10) {
        return (
            <g>
                <text
                    x={x + width / 2}
                    y={y + radius}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {value?.toString().toUpperCase()[0]}
                </text>
            </g>
        );
    }
    return null;
};

const GraphTimeLine = (props: IGraphProps) => {
    const { label, data, durationMs, width, startDateTime } = props;
    const appContext = useContext(AppContext);

    const isDarkTheme = appContext.isDark;
    const accentTrue = lightBlue[isDarkTheme ? 900 : 500];
    const accentFalse = deepOrange[isDarkTheme ? 800 : 400];

    const now = startDateTime ?? DateTimeProvider.now();
    const past = startDateTime ?? DateTimeProvider.now();
    past.setTime(now.getTime() - durationMs);
    const domainGraph = scaleTime().domain([past, now]);

    const reversedData = [...data].reverse();
    const firstEntry = reversedData[0];
    const lastEntry = reversedData.at(-1);
    const entriesCount = reversedData.length;

    const transformedDataItem: ObjectDictAny = {};

    // From start of graph to first entry
    transformedDataItem[`t0`] = domainGraph(new Date(firstEntry.id).getTime()) - domainGraph(past.getTime());
    transformedDataItem[`v0`] = firstEntry.value === 'true' ? 'false' : 'true';;

    // From first entry to last entry
    for (let i = 1; i < reversedData.length; i++) {
        const currentElement = reversedData[i];
        const previousElement = reversedData[i - 1];
        transformedDataItem[`t${i}`] = domainGraph(new Date(currentElement.id).getTime()) - domainGraph(new Date(previousElement.id).getTime());
        transformedDataItem[`v${i}`] = previousElement.value;
    }

    // Period from last state change until present
    if (lastEntry) {
        transformedDataItem[`t${entriesCount}`] = domainGraph(now.getTime()) - domainGraph(new Date(lastEntry.id).getTime());
        transformedDataItem[`v${entriesCount}`] = lastEntry.value;
    }

    return (
        <Stack direction="row" spacing={2}>
            {!!label && (
                <Typography sx={{ pt: '2px' }}>{label}</Typography>
            )}
            <BarChart
                width={width}
                height={60}
                data={[transformedDataItem]}
                layout="vertical"
                barSize={20}
                maxBarSize={20}
                barGap={0}
            >
                <XAxis type="number" axisLine={false} interval="preserveStartEnd" tickFormatter={(v) => {
                    var date = domainGraph.invert(v);
                    return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`
                }} />
                <YAxis type="category" domain={[0]} hide />
                {new Array(reversedData.length + 1).fill(0).map((_, i) => {
                    return (
                        <Bar
                            key={`t${i}`}
                            dataKey={`t${i}`}
                            stackId="0"
                            barSize={20}
                            maxBarSize={20}
                            fill={transformedDataItem[`v${i}`] === 'true' ? accentTrue : accentFalse}
                        >
                            <LabelList
                                dataKey={`v${i}`}
                                content={renderCustomizedTimeLineLabel}
                            />
                        </Bar>
                    );
                })}
            </BarChart>
        </Stack>
    );
}

const ChartGenericTooltip = ({ active, payload, domain, units }: { active?: boolean, payload?: any, domain: ScaleTime<number, number, never>, units?: string }) => {
    if (active && payload && payload.length) {
        const dateTime = domain.invert(payload[0].payload.key) as Date;
        return (
            <Paper sx={{ p: 2, px: 3, maxWidth: '180px' }} variant="elevation" elevation={4}>
                <Typography>{`${payload[0].value}${units || ''}`}</Typography>
                <ReactTimeago date={dateTime} />
                <Typography variant="caption" color="textSecondary" component="div">{`${dateTime.getFullYear()}-${dateTime.getMonth().toString().padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')} ${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`}</Typography>
            </Paper>
        );
    }

    return null;
};

const GraphArea = (props: IGraphProps) => {
    const { data, durationMs, width, height, startDateTime } = props;
    const appContext = useContext(AppContext);

    const yKey = "value";
    const xKey = "key";

    const now = startDateTime ?? DateTimeProvider.now();
    const past = startDateTime ?? DateTimeProvider.now();
    past.setTime(now.getTime() - durationMs);
    const domainGraph = scaleTime().domain([past, now]);
    const ticksHours = timeHour.every(1)!;
    const ticks = domainGraph.ticks(ticksHours).map(i => i.toString());

    const transformedData = data?.map(d => ({ key: domainGraph(new Date(d.id).getTime()), value: d.value })) ?? [];

    const firstDataPoint = data?.at(-1);
    const lastDataPoint = data ? data[0] : undefined;

    const min = arrayMin(transformedData, d => parseFloat(d.value) || 0);
    const max = arrayMax(transformedData, d => parseFloat(d.value) || 0);
    const dMin = Math.floor((min || 0) * 0.98);
    const dMax = Math.ceil((max || 0) * 1.05);

    return (
        <ComposedChart
            width={width}
            height={height}
            data={transformedData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis domain={[0, 1]} ticks={ticks || []} dataKey={xKey} type="number" hide />
            <YAxis allowDecimals={false} domain={[dMin, dMax]} tickSize={0} tickMargin={4} interval="preserveStartEnd" minTickGap={32} width={28} />
            {(typeof firstDataPoint !== 'undefined') && (
                <Line type="monotone" dot={false} data={[
                    { key: domainGraph(past.getTime()), value: firstDataPoint.value },
                    { key: domainGraph(new Date(firstDataPoint.id).getTime()), value: firstDataPoint.value }
                ]} dataKey="value" stroke="#aeaeae" strokeDasharray="5 3" />
            )}
            <Area
                type="basis"
                dataKey={yKey}
                fill={appContext.isDark ? "#ffffff" : "#000000"}
                fillOpacity={0.1}
                stroke="#aeaeae"
                strokeWidth={1} />
            {lastDataPoint && (
                <Line type="monotone" dot={false} data={[
                    { key: domainGraph(new Date(lastDataPoint.id).getTime()), value: lastDataPoint.value },
                    { key: domainGraph(now.getTime()), value: lastDataPoint.value }
                ]} dataKey="value" stroke="#aeaeae" strokeDasharray="5 3" />
            )}
            <Tooltip content={<ChartGenericTooltip domain={domainGraph} />} />
        </ComposedChart>
    );
};

const Graph = (props: IGraphProps) => {
    const { data } = props;
    const { t } = useLocale("App", "Placeholders");

    if (!data || data.length <= 0) {
        return <NoDataPlaceholder content={t("NoData")} />
    }

    const isBoolean = data?.length && (data[0].value === 'true' || data[0].value === 'false');
    if (isBoolean) {
        return <Box p={2}><GraphTimeLine {...props} /></Box>;
    } else return <GraphArea {...props} />
};

export default Graph;
