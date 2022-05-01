import React, { useEffect, useMemo, useState } from 'react';
import { orderBy } from '../../src/helpers/ArrayHelpers';
import { useLoadAndError } from '../../src/hooks/useLoadingAndError';
import HttpService from '../../src/services/HttpService';
import IBlobInfoModel from '../../src/storage/IBlobInfoModel';

export interface ILogViewerProps {
    text: string;
    height: number;

}

interface ILogViewerLineProps {
    number: number;
    data: any;
    lineHeight: number;
}

const logLineRegex = new RegExp(/\[(.*)\]\s\((\w+)\)\s(.*)/);

const LogLevelBadge = ({ level }: { level: string }) => {
    let color = 'gray';
    switch (level) {
        case 'Information': color = 'DodgerBlue'; break;
        case 'Warning': color = 'DarkOrange'; break;
        case 'Fatal':
        case 'Error': color = 'DarkRed'; break;
    }

    return <span style={{ backgroundColor: color, padding: '2px', paddingLeft: '6px', paddingRight: '6px', borderRadius: 4, marginRight: '8px', fontSize: '10px', textTransform: 'uppercase' }}>{level.substring(0, 3)}</span>
};

export const LogViewerLine = (props: ILogViewerLineProps) => {
    const { number, data, lineHeight } = props;
    const matches = logLineRegex.exec(data);
    const timeStamp = matches ? new Date(matches[1]) : new Date(0);
    return (
        <div style={{ top: `${number * lineHeight}px`, position: 'absolute' }}>
            <span style={{ paddingLeft: '8px', minWidth: '60px', display: 'inline-block' }}>{number}</span>
            {matches && <span style={{ marginRight: '8px' }}>{timeStamp.getUTCHours().toString().padStart(2, '0')}:{timeStamp.getUTCMinutes().toString().padStart(2, '0')}:{timeStamp.getUTCSeconds().toString().padStart(2, '0')}.{timeStamp.getMilliseconds().toString().padEnd(3, '0')}</span>}
            {matches && <LogLevelBadge level={matches[2]} />}
            <div style={{ opacity: 0.8, display: 'inline-block', height: '1.3rem' }}>{matches ? matches[3] : data}</div>
        </div>
    )
};

export function useLog(entityId: string | number | undefined, getLogs: (() => Promise<IBlobInfoModel[]>) | undefined) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loadedIndex, setLoadedIndex] = useState(0);

    const logs = useLoadAndError(getLogs);
    const orderedLogs = useMemo(() => orderBy(logs.item, (ia, ib) => ia.modifiedTimeStamp && ib.modifiedTimeStamp ? ib.modifiedTimeStamp.getTime() - ia.modifiedTimeStamp.getTime() : 0), [logs.item]);

    useEffect(() => {
        const loadNextLog = async (blob: IBlobInfoModel) => {
            const response = await HttpService.getAsync(`/stations/logging/download?stationId=${entityId}&blobName=${blob.name}`) as { fileContents: string };
            const contentBuffer = Buffer.from(response.fileContents, 'base64');
            const logText = contentBuffer.toString('utf8');
            setText(logText.trimStart());
        }

        if (entityId && orderedLogs) {
            const nextLog = orderedLogs[0];
            loadNextLog(nextLog);
        }
    }, [entityId, orderedLogs]);

    return {
        text: text,
        loading: loading
    };
}

export default function LogViewer(props: ILogViewerProps) {
    const { text, height } = props;
    const lineHeight = 20.8;
    const overscan = 20;
    const reverse = true;
    const [scrollPosition, setScrollPosition] = useState(0);

    const numberOfLinesInView = Math.ceil(height / lineHeight);

    const lines = useMemo(() => {
        const split = text.split('\n');
        if (reverse) return split.reverse();
        return split;
    }, [reverse, text]);
    const linesCount = lines.length;

    // Calcualte view
    const firstVisibleLine = Math.floor(scrollPosition / lineHeight);
    const startLine = Math.max(firstVisibleLine - overscan, 0);
    const endLine = Math.min(firstVisibleLine + numberOfLinesInView + overscan, linesCount);
    const linesInView = lines.slice(startLine, endLine);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollPosition(e.currentTarget.scrollTop);
    };

    return (
        <>
            <div onScroll={handleScroll} style={{ position: 'relative', height: height, overflow: 'scroll', fontFamily: '"Monaco", monospace', fontSize: '12px', whiteSpace: 'pre' }}>
                <div style={{ height: `${linesCount * lineHeight}px` }}>
                    {linesInView.map((lineText, i) => <LogViewerLine key={i} number={startLine + i} lineHeight={lineHeight} data={lineText} />)}
                </div>
            </div>
            <div>
                <div>Lines count: {linesCount}</div>
                <div>Lines in view: {numberOfLinesInView} Overscan: {overscan}</div>
                <div>Start line: {startLine}</div>
                <div>First visible line: {firstVisibleLine}</div>
                <div>End line: {endLine}</div>
            </div>
        </>
    );
}
