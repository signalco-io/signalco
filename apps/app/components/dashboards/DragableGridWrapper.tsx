import React from 'react';
import { ChildrenProps } from '@signalco/ui';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

export default function DragableGridWrapper(props: { order: string[]; orderChanged: (newOrder: string[]) => void; } & ChildrenProps) {
    const { order, children } = props;
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
            const oldIndex = order.indexOf(active.id.toString());
            const newIndex = order.indexOf(over.id.toString());
            const newOrderedWidgets = arrayMove(order, oldIndex, newIndex);
            const newOrder = [];
            for (let i = 0; i < newOrderedWidgets.length; i++) {
                newOrder.push(order[i]);
            }
        }
    }

    return (
        <DndContext
            sensors={sensors}
            modifiers={[snapCenterToCursor]}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragEnd}>
            <SortableContext items={order} strategy={undefined}>
                {children}
            </SortableContext>
        </DndContext>
    );
}
