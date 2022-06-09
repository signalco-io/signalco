import { DraggableAttributes } from '@dnd-kit/core';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import Widget, { WidgetProps } from '../widgets/Widget';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export interface DisplayWidgetProps {
    style?: React.CSSProperties | undefined;
    elementRef?: React.Ref<unknown>;
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
}

export default function DisplayWidget(props: WidgetProps & DisplayWidgetProps) {
    const { style, elementRef, attributes, listeners, ...rest } = props;
    const [span, setSpan] = useState(({
        colSpan: (rest.config as any)?.columns || 1,
        rowSpan: (rest.config as any)?.columns || 1
    }));

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
