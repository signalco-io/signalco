import React, { useState } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DraggableAttributes } from '@dnd-kit/core';
import Widget, { WidgetProps } from '../widgets/Widget';

export interface DisplayWidgetProps {
    style?: React.CSSProperties | undefined;
    elementRef?: React.Ref<HTMLDivElement>;
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
}

type WidgetConfig = {
    columns?: number;
    rows?: number;
}

export default function DisplayWidget(props: WidgetProps & DisplayWidgetProps) {
    const { style, elementRef, attributes, listeners, ...rest } = props;
    const [span, setSpan] = useState({
        colSpan: (rest.config as WidgetConfig)?.columns || 2,
        rowSpan: (rest.config as WidgetConfig)?.rows || 2
    });

    return (
        <div
            ref={elementRef}
            style={{
                gridRowStart: `span ${span.rowSpan}`,
                gridColumnStart: `span ${span.colSpan}`,
                ...style
            }}
            {...attributes}
            {...listeners}>
            <Widget {...rest} onResize={(r, c) => setSpan({ rowSpan: r, colSpan: c })} />
        </div>
    );
}
