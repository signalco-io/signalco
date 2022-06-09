import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { IWidgetProps } from '../widgets/Widget';
import { CSS } from '@dnd-kit/utilities';
import { draggingUpscale } from './DashboardView';
import { DisplayWidget } from "./DisplayWidget";

export function DragableWidget(props: IWidgetProps) {
    const {
        isDragging, attributes, listeners, setNodeRef, transform, transition,
    } = useSortable({ id: props.id, disabled: !props.isEditMode });

    let customTransform;
    if (transform) {
        customTransform = {
            scaleX: isDragging ? draggingUpscale : 1,
            scaleY: isDragging ? draggingUpscale : 1,
            x: transform.x,
            y: transform.y
        };
    }

    return <DisplayWidget
        elementRef={setNodeRef}
        style={{
            transform: customTransform ? CSS.Transform.toString(customTransform) : undefined,
            transition,
        }} {...props} attributes={attributes} listeners={listeners} />;
}
