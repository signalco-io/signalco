'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { List } from '@signalco/ui-primitives/List';
import { QueryListSkeleton, QueryListItemCreate } from '@signalco/ui/QueryList';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/Loadable';
import { lexinsert } from '@signalco/lexorder';
import { orderBy } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';
import { useProcessTaskDefinitions } from '../../../src/hooks/useProcessTaskDefinitions';
import { useProcessTaskDefinitionCreate } from '../../../src/hooks/useProcessTaskDefinitionCreate';
import { useProcessRunTasks } from '../../../src/hooks/useProcessRunTasks';
import { TaskListItem } from './TaskListItem';

const TaskListSuggestions = dynamic(() => import('./TaskListSuggestions').then(mod => mod.TaskListSuggestions), {ssr: false });

type TaskListProps = {
    processId: string;
    runId?: string;
    editable: boolean;
};

export function TaskList({ processId, runId, editable }: TaskListProps) {
    const [selectedTaskId, setSelectedTask] = useSearchParam('task');
    const taskDefinitionCreate = useProcessTaskDefinitionCreate();
    const taskDefinitionUpdate = useProcessTaskDefinitionUpdate();

    const { data: taskDefinitions, isLoading: isLoadingTaskDefinitions, error: errorTaskDefinitions } = useProcessTaskDefinitions(processId);
    const { data: tasks, isLoading: isLoadingTasks, error: errorTasks } = useProcessRunTasks(processId, runId);

    const [showSuggestions, setShowSuggestions] = useState(false);
    useEffect(() => {
        if (!runId && (taskDefinitions?.length ?? 0) > 0) {
            const timeoutId = setTimeout(() => {
                setShowSuggestions(true);
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [runId, taskDefinitions]);

    const taskListItems = useMemo(() => {
        return orderBy(taskDefinitions?.map(td => ({
            taskDefinition: td,
            task: tasks?.find(t => t.taskDefinitionId === td.id)
        })) ?? [], (a, b) => a.taskDefinition.order.localeCompare(b.taskDefinition.order));
    }, [taskDefinitions, tasks]);

    const handleCreateTaskDefinition = async () => {
        const result = await taskDefinitionCreate.mutateAsync({
            processId,
            text: 'New task'
        });
        if (result?.id) {
            setSelectedTask(result?.id);
        }
    };

    const orderedItems = useMemo(() => {
        return taskListItems.map(tdi => tdi.taskDefinition.id.toString());
    }, [taskListItems]);

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        if (!over) return;

        const overIndex = orderedItems.indexOf(over.id.toString());
        const activeIndex = orderedItems.indexOf(active.id.toString());

        const reorderedArray = arrayMove(orderedItems, activeIndex, overIndex);

        console.log('reorderedArray', reorderedArray);

        const newLocationIdex = reorderedArray.indexOf(active.id.toString());
        const beforeId = reorderedArray[newLocationIdex - 1];
        const afterId = reorderedArray[newLocationIdex + 1];

        // Determine previous and next task definition
        const activeTaskDefinition = taskListItems.find(tdi => tdi.taskDefinition.id === active.id);
        if (!activeTaskDefinition) return;

        const beforeTaskDefinition = taskListItems.find(tdi => tdi.taskDefinition.id === beforeId);
        const afterTaskDefinition = taskListItems.find(tdi => tdi.taskDefinition.id === afterId);

        console.log('lexinsert', beforeTaskDefinition?.taskDefinition?.order, afterTaskDefinition?.taskDefinition?.order)
        const newOrder = lexinsert(beforeTaskDefinition?.taskDefinition?.order, afterTaskDefinition?.taskDefinition?.order);

        console.log('newOrder', newOrder);

        await taskDefinitionUpdate.mutateAsync({
            processId,
            taskDefinitionId: activeTaskDefinition.taskDefinition.id,
            order: newOrder
        });
    };

    return (
        <Loadable
            isLoading={isLoadingTaskDefinitions || isLoadingTasks}
            loadingLabel="Loading task definitions..."
            placeholder={<QueryListSkeleton itemClassName="h-9 w-full" />}
            error={errorTaskDefinitions || errorTasks}>
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={orderedItems} strategy={verticalListSortingStrategy}>
                    <List className="divide-y rounded-lg border">
                        {taskListItems.map((item, taskIndex) => (
                            <TaskListItem
                                key={item.taskDefinition.id}
                                selected={selectedTaskId === item.taskDefinition.id.toString()}
                                taskDefinition={item.taskDefinition}
                                runId={runId}
                                task={item.task}
                                taskIndex={taskIndex}
                                editable={editable} />
                        ))}
                        {(editable && !runId) && (
                            <QueryListItemCreate
                                label="Add task"
                                onSelected={handleCreateTaskDefinition}
                                loading={taskDefinitionCreate.isPending} />
                        )}
                        {(!editable && taskListItems.length <= 0) && (
                            <NoDataPlaceholder className="p-2">No tasks</NoDataPlaceholder>
                        )}
                    </List>
                </SortableContext>
            </DndContext>
            {showSuggestions && (
                <TaskListSuggestions processId={processId} />
            )}
        </Loadable>
    );
}
