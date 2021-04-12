import React, { useEffect, useState } from "react";
import { Area, AreaChart } from "recharts";
import { IDeviceTarget } from "../../../src/devices/Device";
import { IHistoricalValue } from "../Device";
import { rowHeight } from "./Shared";

export interface IWidgetPartGraphConfig {
    columns: number,
    rows: number,
    value: () => Promise<IHistoricalValue[]>
    valueSource: IDeviceTarget,
    duration?: string
}

const WidgetPartGraph = ({ columnWidth, config }: { columnWidth: number, config: IWidgetPartGraphConfig }) => {
    // const [isLoading, setIsLoading] = useState<boolean>(true);
    const [stateHistory, setStateHistory] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await config.value();

                var mappedData = data.map(i => ({
                    timeStamp: i.timeStamp,
                    value: Number.parseFloat(i.valueSerialized)
                }));

                const minValue = Math.min(...mappedData.filter(n => !Number.isNaN(n)).map(i => i.value));
                for (const i of mappedData) {
                    i.value -= minValue;
                }

                setStateHistory(mappedData);

            } catch (err) {
                // TODO: Show error message
                console.warn('Failed to load history data', err, config)
            } finally {
                // setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <AreaChart
            width={columnWidth * config.columns}
            height={rowHeight * config.rows}
            data={stateHistory}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Area type="basis"
                dataKey="value"
                dot={false}
                fill="#ffffff"
                fillOpacity={0.1}
                stroke="#aeaeae"
                strokeWidth={2} />
        </AreaChart>
    );
}

export default WidgetPartGraph;