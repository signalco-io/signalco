import React from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { ListTreeItem } from '@signalco/ui-primitives/ListTreeItem';
import { CopyToClipboardInput } from '@signalco/ui/CopyToClipboardInput';
import { ParsedJson } from '@signalco/js';
import { JsonNonArrayVisualizer } from './JsonNonArrayVisualizer';
import { JsonArrayVisualizer } from './JsonArrayVisualizer';

export function ObjectVisualizer(props: { name: string; value: ParsedJson; defaultOpen?: boolean; }) {
    const { name, value, defaultOpen } = props;
    const isArray = Array.isArray(value);
    const hasChildren = (typeof value === 'object' && value !== null) || isArray;

    console.log(name, value)

    return (
        <ListTreeItem
            defaultOpen={defaultOpen}
            label={(
                <Row spacing={1}>
                    {name && (
                        <div className="min-w-[120px]">
                            <Typography title={`${name} (${(isArray ? `array[${value.length}]` : typeof value)})`}>
                                {name}
                            </Typography>
                        </div>
                    )}
                    {!hasChildren && (
                        // TODO: Implement visualizer for different data types
                        //     - number
                        //     - color (hex)
                        //     - URL
                        //     - GUID/UUID
                        //     - boolean
                        //     - ability to unset value
                        <CopyToClipboardInput defaultValue={value?.toString()} />
                    )}
                </Row>
            )}>
            {hasChildren && (
                <div className="ml-2">
                    {isArray
                        ? <JsonArrayVisualizer name={name} value={value as Array<ParsedJson>} />
                        : <JsonNonArrayVisualizer value={value} />}
                </div>
            )}
        </ListTreeItem>
    );
}
