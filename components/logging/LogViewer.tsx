import { CircularProgress, Stack } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { orderBy } from '../../src/helpers/ArrayHelpers';
import { useLoadAndError } from '../../src/hooks/useLoadingAndError';
import DateTimeProvider from '../../src/services/DateTimeProvider';
import IBlobInfoModel from '../../src/storage/IBlobInfoModel';

export interface ILogViewerProps {
    lines: string[] | undefined;
    linesCount: number;
    height: number;
    isLoading: boolean
    error?: string | undefined,
    handleScroll?: (startLine: number, endLine: number) => void
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
            {matches && <span style={{ marginRight: '8px' }}>{DateTimeProvider.formatTimeDetailed(timeStamp)}</span>}
            {matches && <LogLevelBadge level={matches[2]} />}
            <div style={{ opacity: 0.8, display: 'inline-block', height: '1.3rem' }}>{matches ? matches[3] : data}</div>
        </div>
    )
};

export function useLog(entityId: string | number | undefined, getLogs: (() => Promise<IBlobInfoModel[]>) | undefined, getBlob: (blob: IBlobInfoModel) => Promise<string | undefined>) {
    const [lines, setLines] = useState<string[]>([]);
    const [linesCount, setLinesCount] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loadedIndexes, setLoadedIndexes] = useState<number[]>([]);

    const logs = useLoadAndError(getLogs);
    const orderedLogs = useMemo(() => orderBy(logs.item, (ia, ib) => ia.modifiedTimeStamp && ib.modifiedTimeStamp ? ib.modifiedTimeStamp.getTime() - ia.modifiedTimeStamp.getTime() : 0), [logs.item]);

    const loadLog = useCallback(async (index: number) => {
        if (!orderedLogs) return;

        setIsLoading(true);
        try {
            if (loadedIndexes[loadedIndexes.length - 1] === index) return;
            setLoadedIndexes([...loadedIndexes, index]);
            const blob = orderedLogs[index];

            console.debug('Loading log', blob);

            const logText = await getBlob(blob);
            if (!logText) {
                throw new Error('Empty log');
            }

            const split = logText.trimStart().split('\n');

            // Trim end for empty lines
            while (!split[split.length - 1].length) {
                split.pop();
            }

            lines.push(...split.reverse());
            setLines(lines);
            setLinesCount(linesCount + split.length);
        } catch (err) {
            setError('' + err);
        } finally {
            setIsLoading(false);
        }
    }, [getBlob, lines, linesCount, loadedIndexes, orderedLogs]);

    useEffect(() => {
        if (entityId && orderedLogs && !loadedIndexes.length) {
            loadLog(0);
        }
    }, [entityId, loadLog, loadedIndexes, orderedLogs]);

    const handleScroll = useCallback((startLine: number, endLine: number) => {
        if (!isLoading && endLine === linesCount && loadedIndexes.length && startLine !== endLine) {
            console.log('scroll')
            console.log(loadedIndexes)
            loadLog(loadedIndexes[loadedIndexes.length - 1] + 1);
        }
    }, [isLoading, linesCount, loadLog, loadedIndexes]);

    return {
        lines: lines,
        linesCount: linesCount,
        isLoading: isLoading || logs.isLoading,
        error: error || logs.error,
        handleScroll: handleScroll
    };
}

export default function LogViewer(props: ILogViewerProps) {
    const { lines, linesCount, height, isLoading, handleScroll } = props;
    const lineHeight = 20.8;
    const overscan = 20;
    const [scrollPosition, setScrollPosition] = useState(0);

    const numberOfLinesInView = Math.ceil(height / lineHeight);

    // Calcualte view
    const firstVisibleLine = Math.floor(scrollPosition / lineHeight);
    const startLine = Math.max(firstVisibleLine - overscan, 0);
    const endLine = Math.min(firstVisibleLine + numberOfLinesInView + overscan, linesCount);
    const linesInView = lines?.slice(startLine, endLine);

    const handleScrollInternal = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollPosition(e.currentTarget.scrollTop);
    };

    useEffect(() => {
        if (handleScroll) {
            handleScroll(startLine, endLine);
        }
    }, [startLine, endLine, handleScroll])

    return (
        <div onScroll={handleScrollInternal} style={{ position: 'relative', height: height, overflow: 'scroll', fontFamily: '"Monaco", monospace', fontSize: '12px', whiteSpace: 'pre' }}>
            <div style={{ height: `${linesCount * lineHeight}px` }}>
                {linesInView?.map((lineText, i) => <LogViewerLine key={i} number={startLine + i} lineHeight={lineHeight} data={lineText} />)}
            </div>
            {isLoading && (
                <Stack alignItems="center" sx={{ p: 2 }}>
                    <CircularProgress />
                </Stack>
            )}
        </div>
    );
}
