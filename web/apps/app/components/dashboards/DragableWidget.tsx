import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { WidgetProps } from '../widgets/Widget';
import DisplayWidget from './DisplayWidget';

const draggingUpscale = 1.1;

export default function DragableWidget(props: WidgetProps) {
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
