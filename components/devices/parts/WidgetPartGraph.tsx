import React from "react";
import { Area, AreaChart } from "recharts";
import { rowHeight } from "./Shared";

export interface IWidgetPartGraphConfig {
    columnWidth: number,
    columns: number,
    rows: number
}

const WidgetPartGraph = ({config}: {config: IWidgetPartGraphConfig}) => {
    const historicalData = [
        {
            timeStamp: '2021-03-02',
            value: 5
        },
        {
            timeStamp: '2021-02-02',
            value: 4
        },
        {
            timeStamp: '2021-01-02',
            value: 0.5
        },
        {
            timeStamp: '2021-01-15',
            value: 6
        }
    ];

    return (
        <AreaChart width={config.columnWidth * config.columns} height={rowHeight * config.rows} data={historicalData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Area type="basis" dataKey="value" dot={false} fill="#ffffff" fillOpacity={0.1} stroke="#aeaeae" strokeWidth={2} />
        </AreaChart>
    );
}

export default WidgetPartGraph;