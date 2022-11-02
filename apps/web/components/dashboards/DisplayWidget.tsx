import React, { useState } from 'react';
import { Box } from '@mui/system';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DraggableAttributes } from '@dnd-kit/core';
import Widget, { WidgetProps } from '../widgets/Widget';

export interface DisplayWidgetProps {
    style?: React.CSSProperties | undefined;
    elementRef?: React.Ref<unknown>;
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
}

export default function DisplayWidget(props: WidgetProps & DisplayWidgetProps) {
    const { style, elementRef, attributes, listeners, ...rest } = props;
    const [span, setSpan] = useState({
        colSpan: (rest.config as any)?.columns || 2,
        rowSpan: (rest.config as any)?.rows || 2
    });

    return (
        <Box
            ref={elementRef}
            style={{
                gridRowStart: `span ${span.rowSpan}`,
                gridColumnStart: `span ${span.colSpan}`,
                ...style
            }} {...attributes} {...listeners}>
            <Widget {...rest} onResize={(r, c) => setSpan({ rowSpan: r, colSpan: c })} />
        </Box>
    );
}
