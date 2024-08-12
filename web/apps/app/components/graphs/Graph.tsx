import { TooltipProps } from 'recharts/types/component/Tooltip';
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, LabelList, LabelProps, Legend, Line, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { type SVGProps } from 'react';
import { ScaleTime, scaleTime, timeHour } from 'd3';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { cx } from '@signalco/ui-primitives/cx';
import { Card } from '@signalco/ui-primitives/Card';
import { Timeago } from '@signalco/ui/Timeago';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/Loadable';
import { camelToSentenceCase, ObjectDictAny } from '@signalco/js';
import { now } from '../../src/services/DateTimeProvider';
import { useLocalePlaceholders } from '../../src/hooks/useLocale';
import { isBoolean } from '../../src/helpers/ValueSerializedHelper';

export type GraphDataPoint = {
    id: string;
    value: string | number | { [key: string]: string | number };
}

export type GraphLimit = {
    id: string;
    value: string | number | undefined;
};

type InnerGraphProps = {
    data: GraphDataPoint[];
    limits?: GraphLimit[];
    durationMs: number;
    width: number;
    height: number;
    startDateTime?: Date;
    hideLegend?: boolean;
    adaptiveDomain?: boolean;
    aggregate?: number;
}

export type GraphProps = InnerGraphProps & {
    isLoading?: boolean;
    error?: unknown;
    label?: string;
    discrete?: boolean;
}

const renderCustomizedTimeLineLabel = ({ x, y, width, value }: Omit<SVGProps<SVGTextElement>, 'viewBox'> & LabelProps) => {
    const radius = 10;
    const widthNumber = Number(width) || 0;

    if (widthNumber <= 10) {
        return null;
    }

    return (
        <g>
            <text
                x={Number(x) + widthNumber / 2}
                y={Number(y) + radius}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {value?.toString().toUpperCase()[0]}
            </text>
        </g>
    );
};

function GraphTimeLine({ data, durationMs, width, startDateTime, hideLegend }: InnerGraphProps) {
    const nowTime = startDateTime ?? now();
    const past = startDateTime ?? now();
    past.setTime(nowTime.getTime() - durationMs);
    const domainGraph = scaleTime().domain([past, nowTime]);

    const reversedData = [...data].reverse();
    const firstEntry = reversedData[0];
    const lastEntry = reversedData.at(-1);
    const entriesCount = reversedData.length;

    const transformedDataItem: ObjectDictAny = {};

    // From start of graph to first entry
    transformedDataItem['t0'] = domainGraph(new Date(firstEntry?.id ?? 0).getTime()) - domainGraph(past.getTime());
    transformedDataItem['v0'] = firstEntry?.value === 'true' ? 'false' : 'true';

    // From first entry to last entry
    for (let i = 1; i < reversedData.length; i++) {
        const currentElement = reversedData[i];
        const previousElement = reversedData[i - 1];
        transformedDataItem[`t${i}`] = domainGraph(new Date(currentElement?.id ?? 0).getTime()) - domainGraph(new Date(previousElement?.id ?? 0).getTime());
        transformedDataItem[`v${i}`] = previousElement?.value;
    }

    // Period from last state change until present
    if (lastEntry) {
        transformedDataItem[`t${entriesCount}`] = domainGraph(nowTime.getTime()) - domainGraph(new Date(lastEntry.id).getTime());
        transformedDataItem[`v${entriesCount}`] = lastEntry.value;
    }

    return (
        <BarChart
            width={width}
            height={60}
            data={[transformedDataItem]}
            layout="vertical"
            barSize={20}
            maxBarSize={20}
            barGap={0}
        >
            <XAxis
                type="number"
                axisLine={false}
                interval="preserveStartEnd"
                tickFormatter={(v) => {
                    const date = domainGraph.invert(v);
                    return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`
                }}
                hide={hideLegend} />
            <YAxis type="category" domain={[0, 0]} hide />
            {new Array(reversedData.length + 1).fill(0).map((_, i) => {
                return (
                    <Bar
                        key={`t${i}`}
                        dataKey={`t${i}`}
                        stackId="0"
                        barSize={20}
                        maxBarSize={20}
                        className={cx(
                            transformedDataItem[`v${i}`] === 'true' ? 'fill-sky-600' : 'fill-orange-500'
                        )}
                    >
                        <LabelList
                            dataKey={`v${i}`}
                            content={renderCustomizedTimeLineLabel}
                        />
                    </Bar>
                );
            })}
        </BarChart>
    );
}

function ChartGenericTooltip({
    active,
    payload,
    domain,
    units
}: TooltipProps<string | number | (string | number)[], string | number> &
    { domain: ScaleTime<number, number, never>, units?: string }) {
    if (active && payload && payload.length) {
        const dateTime = domain.invert(payload[0]?.payload.key) as Date;
        return (
            <Card className="max-w-xs">
                <Typography>{`${payload[0]?.value}${units || ''}`}</Typography>
                <Timeago date={dateTime} />
                <Typography level="body2">{`${dateTime.getFullYear()}-${dateTime.getMonth().toString().padStart(2, '0')}-${dateTime.getDate().toString().padStart(2, '0')} ${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`}</Typography>
            </Card>
        );
    }

    return null;
}

function aggregateDataByTime(past: Date, nowTime: Date, data: GraphDataPoint[], durationMs: number, domainGraph: ScaleTime<number, number, never>, interval: number) {
    // Aggregate data based on the time (5 minutes)
    const aggregatedData = [];
    const aggregatedPointsCount = Math.ceil(durationMs / interval);
    for (let i = 0; i < aggregatedPointsCount; i++) {
        const aggregatedPoint: { key: number, value: number | null } = {
            key: domainGraph(new Date(past.getTime() + i * interval).getTime()),
            value: null
        };

        const transformedData = data?.map(d => ({ key: domainGraph(new Date(d.id).getTime()), value: d.value })) ?? [];
        const toAggregate = transformedData.filter(d =>
            d.key >= domainGraph(new Date(past.getTime() + i * interval).getTime()) &&
            d.key < domainGraph(new Date(past.getTime() + (i + 1) * interval).getTime()));
        if (toAggregate.length <= 0) {
            // aggregatedPoint.value = aggregatedData.at(i - 1)?.value ?? (typeof firstDataPoint?.value === 'string' ? parseFloat(firstDataPoint.value) : 0);
        } else {
            toAggregate.forEach(c => {
                if (aggregatedPoint.value === null) {
                    aggregatedPoint.value = 0;
                }
                aggregatedPoint.value += typeof c.value === 'string' ? parseFloat(c.value) : 0;
            });
            if (aggregatedPoint.value !== null) {
                aggregatedPoint.value /= toAggregate.length;
            }
        }

        aggregatedData.push(aggregatedPoint);
    }

    // Insert last data point
    const lastDataPoint = data ? data[0] : undefined;
    aggregatedData.push({
        key: domainGraph(nowTime.getTime()),
        value: typeof lastDataPoint?.value === 'string' ? parseFloat(lastDataPoint.value) : 0
    })

    // Populate missing data points
    for (let i = 0; i < aggregatedData.length; i++) {
        const aggregatedDataPoint = aggregatedData[i];
        if (aggregatedDataPoint && aggregatedDataPoint.value === null) {
            // Pick middle value between previous and next
            const previous = aggregatedData[i - 1];
            const next = aggregatedData[i + 1];
            if (previous?.value && next?.value) {
                aggregatedDataPoint.value = (previous.value + next.value) / 2;
            } else if (previous) {
                aggregatedDataPoint.value = previous.value;
            } else if (next) {
                aggregatedDataPoint.value = next.value;
            } else {
                aggregatedDataPoint.value = 0;
            }
        }
    }

    // Map to values 2 decimal places
    return aggregatedData.map(d => ({ key: d.key, value: d.value !== null ? d.value.toFixed(2) : null }));
}

function GraphArea({ data, durationMs, width, height, startDateTime, hideLegend, adaptiveDomain, aggregate }: InnerGraphProps) {
    const yKey = 'value';
    const xKey = 'key';

    const nowTime = startDateTime ?? now();
    const past = startDateTime ?? now();
    past.setTime(nowTime.getTime() - durationMs);
    const domainGraph = scaleTime().domain([past, nowTime]);
    const ticksHours = timeHour.every(1);
    const ticks = ticksHours ? domainGraph.ticks(ticksHours).map(i => i.toString()) : [];

    const transformedData = data?.map(d => ({ key: domainGraph(new Date(d.id).getTime()), value: d.value })) ?? [];

    const firstDataPoint = data?.at(-1);
    const lastDataPoint = data ? data[0] : undefined;

    const dataTransformedNumbers = transformedData.map(c =>
        typeof c.value === 'string'
            ? parseFloat(c.value)
            : null);
    const isDataNumbers = dataTransformedNumbers.every(c => typeof c === 'number' && !isNaN(c))
    const dataMin = isDataNumbers
        ? Math.min(...dataTransformedNumbers.map(d => typeof d === 'number' ? d : 0))
        : undefined;
    const dataMax = isDataNumbers
        ? Math.max(...dataTransformedNumbers.map(d => typeof d === 'number' ? d : 0))
        : undefined;

    const aggregatedData = aggregate
        ? aggregateDataByTime(past, nowTime, data, durationMs, domainGraph, aggregate)
        : transformedData;

    return (
        <ComposedChart
            width={width}
            height={height}
            data={aggregatedData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--graph-stroke)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--graph-stroke)" stopOpacity={0} />
                </linearGradient>
            </defs>
            <XAxis
                domain={[domainGraph(new Date(firstDataPoint?.id ?? 0).getTime()), domainGraph(new Date(lastDataPoint?.id ?? 0).getTime())]}
                ticks={ticks || []}
                dataKey={xKey}
                type="number"
                hide />
            <YAxis
                allowDecimals={false}
                domain={[dataMin ?? 'dataMain', dataMax ?? 'dataMax']}
                tickSize={0}
                tickMargin={4}
                interval="preserveStartEnd"
                minTickGap={32}
                width={28}
                hide={hideLegend} />
            {(!adaptiveDomain && typeof firstDataPoint !== 'undefined') && (
                <Line type="monotone"
                    dot={false}
                    data={[
                        { key: domainGraph(past.getTime()), value: firstDataPoint.value },
                        { key: domainGraph(new Date(firstDataPoint.id).getTime()), value: firstDataPoint.value }
                    ]}
                    dataKey="value"
                    stroke="hsl(var(--border))"
                    strokeWidth={2}
                    strokeDasharray="5 3" />
            )}
            <Area
                type="basis"
                dataKey={yKey}
                fill="url(#colorUv)"
                fillOpacity={1}
                stroke="var(--graph-stroke)"
                strokeWidth={2} />
            {(!adaptiveDomain && typeof lastDataPoint !== 'undefined') && (
                <Line type="monotone"
                    dot={false}
                    data={[
                        { key: domainGraph(new Date(lastDataPoint.id).getTime()), value: lastDataPoint.value },
                        { key: domainGraph(nowTime.getTime()), value: lastDataPoint.value }
                    ]}
                    dataKey="value"
                    stroke="hsl(var(--border))"
                    strokeWidth={2}
                    strokeDasharray="5 3" />
            )}
            <Tooltip content={<ChartGenericTooltip domain={domainGraph} />} />
        </ComposedChart>
    );
}

function GraphBar({ data, limits, aggregate, width, height }: InnerGraphProps) {
    const barKeys = (data?.length ?? 0) > 0
        ? (typeof data[0]?.value === 'object' ? Object.keys(data[0].value) : ['value'])
        : [];

    const graphData = data.map(d => typeof d.value === 'object' ? ({ id: d.id, ...d.value }) : d);

    const usagesAggregated = [];
    if (aggregate) {
        for (let usageIndex = 0; usageIndex < graphData.length; usageIndex++) {
            const curr = graphData[usageIndex];
            if (!curr) {
                continue;
            }
            const currentPoint: ObjectDictAny = curr;

            const previousPoint = usageIndex > 0
                ? usagesAggregated[usageIndex - 1]
                : {};
            if (!previousPoint) {
                continue;
            }

            const aggregatedPoint: ObjectDictAny = {
                id: currentPoint.id
            };
            Object.keys(currentPoint).forEach(cpk => {
                if (cpk === 'id') return;

                aggregatedPoint[cpk] =
                    (typeof currentPoint[cpk] === 'number' ? Number(currentPoint[cpk]) : 0) +
                    (typeof currentPoint[cpk] === 'number' ? Number(previousPoint[cpk]) : 0);
            });
            usagesAggregated.push(aggregatedPoint);
        }
    }

    return (
        <BarChart
            width={width}
            height={height}
            data={aggregate ? usagesAggregated : graphData}
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="id" hide />
            <YAxis />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px 16px'
                }}
                cursor={{
                    stroke: 'hsl(var(--border))',
                    fill: 'rgba(128,128,128,0.2)'
                }} />
            <Legend iconType="circle"
                layout="vertical"
                align="right"
                verticalAlign="top"
                wrapperStyle={{
                    paddingLeft: '16px'
                }} />
            {barKeys.map((bk, bki) => (
                <Bar
                    key={bk}
                    name={camelToSentenceCase(bk)}
                    dataKey={bk}
                    stackId="a"
                    className={cx(
                        bki % 4 === 0 && 'fill-green-600',
                        bki % 4 === 1 && 'fill-sky-600',
                        bki % 4 === 2 && 'fill-amber-600',
                        bki % 4 === 3 && 'fill-zinc-500'
                    )} />
            ))}
            {(limits?.length ?? 0) > 0 && limits?.map(l =>
                (<ReferenceLine
                    key={l.id}
                    y={l.value}
                    strokeDasharray="8 8"
                    className="fill-orange-800"
                    ifOverflow="extendDomain" />)
            )}
        </BarChart>
    );
}

function Graph({ isLoading, error, data, label, discrete, ...rest }: GraphProps) {
    const { t } = useLocalePlaceholders();

    const dataItems = data?.map(d => d.value);
    let GraphComponent = GraphArea;
    if (isBoolean(dataItems))
        GraphComponent = GraphTimeLine;
    if (discrete)
        GraphComponent = GraphBar;

    return (
        <Row spacing={2}>
            {!!label && <Typography>{label}</Typography>}
            <Loadable isLoading={isLoading} loadingLabel="Loading data" error={error} width={100}>
                {!data || data.length <= 0
                    ? <NoDataPlaceholder>{t('NoData')}</NoDataPlaceholder>
                    : <GraphComponent data={data} {...rest} />}
            </Loadable>
        </Row>
    );
}

export default Graph;
