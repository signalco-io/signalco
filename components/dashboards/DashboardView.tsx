import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import useWindowWidth from "../../src/hooks/useWindowWidth";
import { useNavWidth } from "../NavProfile";
import Widget, { IWidgetProps } from "../widgets/Widget";
import { IWidget } from "./Dashboards";
import { CSS } from '@dnd-kit/utilities';
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { IDashboardModel } from "../../src/dashboards/DashboardsRepository";

interface IDragableWidgetProps extends IWidgetProps {
    id: string
}

const DragableWidget = (props: IDragableWidgetProps) => {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id, disabled: !props.isEditMode });

    let customTransform;
    if (transform) {
        customTransform = {
            scaleX: isDragging ? 1.1 : 1,
            scaleY: isDragging ? 1.1 : 1,
            x: transform.x,
            y: transform.y
        };
    }

    const colSpan = (props.config as any)?.columns || 2;
    const rowSpan = (props.config as any)?.rows || 2;

    return (
        <Box ref={setNodeRef} style={{
            transform: customTransform ? CSS.Transform.toString(customTransform) : undefined,
            transition,
            gridRowStart: `span ${rowSpan}`,
            gridColumnStart: `span ${colSpan}`,
        }} {...attributes} {...listeners}>
            <Widget {...props} />
        </Box>
    );
};

const DashboardView = (props: { dashboard: IDashboardModel, isEditing: boolean, handleWidgetRemove: (widget: IWidget) => void, handleWidgetSetConfig: (dashboard: IDashboardModel, widget: IWidget, config: object) => void }) => {
    const { dashboard, isEditing, handleWidgetRemove, handleWidgetSetConfig } = props;
    const [numberOfColumns, setNumberOfColumns] = useState(4);
    const widgetSpacing = 1;
    const widgetSize = 78 + widgetSpacing * 8;

    const navWidth = useNavWidth();

    const dashbaordPadding = 48 + navWidth;
    const [widgetsOrder, setWidgetsOrder] = useState(dashboard.widgets.map(w => w.id));

    useEffect(() => {
        setWidgetsOrder(dashboard.widgets.map(w => w.id));
    }, [dashboard]);

    const windowWidth = useWindowWidth();
    useEffect(() => {
        // When width is less than 400, set to quad column
        const width = window.innerWidth - dashbaordPadding;
        const numberOfColumns = Math.max(4, Math.floor(width / widgetSize));

        setNumberOfColumns(numberOfColumns);
    }, [widgetSize, windowWidth, dashbaordPadding])

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 5
            }
        }),
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 5
            }
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setWidgetsOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    console.debug("Rendering DashboardView")

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
            gap: widgetSpacing,
            width: `${widgetSize * numberOfColumns - widgetSpacing * 8}px`
        }}>
            <DndContext
                sensors={sensors}
                modifiers={[snapCenterToCursor]}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragEnd}>
                <SortableContext items={widgetsOrder} strategy={undefined}>
                    {dashboard.widgets.sort((a, b) => {
                        const oldIndex = widgetsOrder.indexOf(a.id);
                        const newIndex = widgetsOrder.indexOf(b.id);
                        return oldIndex - newIndex;
                    }).map((widget) => (
                        <DragableWidget
                            id={widget.id}
                            key={`widget-${widget.id.toString()}`}
                            onRemove={() => handleWidgetRemove(widget)}
                            isEditMode={isEditing}
                            type={widget.type}
                            config={widget.config}
                            setConfig={(config) => handleWidgetSetConfig(dashboard, widget, config)} />
                    ))}
                </SortableContext>
            </DndContext>
        </Box >
    );
};

export default DashboardView;