import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import useWindowWidth from "../../src/hooks/useWindowWidth";
import { useNavWidth } from "../NavProfile";
import Widget, { IWidgetProps } from "../widgets/Widget";
import { CSS } from '@dnd-kit/utilities';
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { IDashboardModel } from "../../src/dashboards/DashboardsRepository";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { Button, Stack, Typography } from "@mui/material";
import Image from 'next/image';

interface IDragableWidgetProps extends IWidgetProps {
    id: string
}

function DragableWidget(props: IDragableWidgetProps) {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id, disabled: !props.isEditMode });

    const [span, setSpan] = useState(({
        colSpan: (props.config as any)?.columns || 2,
        rowSpan: (props.config as any)?.columns || 2
    }));

    let customTransform;
    if (transform) {
        customTransform = {
            scaleX: isDragging ? 1.1 : 1,
            scaleY: isDragging ? 1.1 : 1,
            x: transform.x,
            y: transform.y
        };
    }

    return (
        <Box ref={setNodeRef} style={{
            transform: customTransform ? CSS.Transform.toString(customTransform) : undefined,
            transition,
            gridRowStart: `span ${span.rowSpan}`,
            gridColumnStart: `span ${span.colSpan}`,
        }} {...attributes} {...listeners}>
            <Widget {...props} onResize={(r, c) => setSpan({ rowSpan: r, colSpan: c })} />
        </Box>
    );
}

function DashboardView(props: { dashboard: IDashboardModel, isEditing: boolean, onAddWidget: () => void }) {
    const { dashboard, isEditing, onAddWidget } = props;
    const [numberOfColumns, setNumberOfColumns] = useState(4);

    const widgetSpacing = 1;
    const widgetSize = 78 + widgetSpacing * 8;
    const navWidth = useNavWidth();
    const windowWidth = useWindowWidth();
    const dashbaordPadding = 48 + navWidth;

    const widgetsOrder = dashboard.widgets.slice().sort((a, b) => a.order - b.order).map(w => w.id);
    const widgets = widgetsOrder.map(wo => dashboard.widgets.find(w => wo === w.id)!);

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

    const handleSetWidgetConfig = (widgetId: string, config: object | undefined) => {
        dashboard.widgets.find(w => w.id === widgetId)?.setConfig(config);
    }

    const handleRemoveWidget = (widgetId: string) => {
        dashboard.widgets.splice(dashboard.widgets.findIndex(w => w.id === widgetId), 1);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = widgetsOrder.indexOf(active.id);
            const newIndex = widgetsOrder.indexOf(over.id);
            const newOrderedWidgets = arrayMove(widgets, oldIndex, newIndex);;
            for (let i = 0; i < newOrderedWidgets.length; i++) {
                runInAction(() => {
                    newOrderedWidgets[i].order = i;
                })
            }
        }
    }

    console.debug("Rendering DashboardView")

    if (widgets.length <= 0) {
        return (
            <Stack alignItems="center" justifyContent="center">
                <Stack sx={{ height: '80vh' }} alignItems="center" justifyContent="center" direction="row">
                    <Stack maxWidth={320} spacing={4} alignItems="center" justifyContent="center">
                        <Image width={280} height={213} alt="No Dashboards placeholder" src="/assets/placeholders/placeholder-no-widgets.svg" />
                        <Typography variant="h1">No Widgets</Typography>
                        <Typography textAlign="center" color="textSecondary">Dashboard is a bit empty.<br />Start by adding a widget from widget store.</Typography>
                        <Button variant="contained" onClick={onAddWidget}>Add Widget</Button>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

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
                    {widgets.map((widget) => (
                        <DragableWidget
                            id={widget.id}
                            key={`widget-${widget.id.toString()}`}
                            onRemove={() => handleRemoveWidget(widget.id)}
                            isEditMode={isEditing}
                            type={widget.type}
                            config={widget.config}
                            setConfig={(config) => handleSetWidgetConfig(widget.id, config)} />
                    ))}
                </SortableContext>
            </DndContext>
        </Box >
    );
}

export default observer(DashboardView);
