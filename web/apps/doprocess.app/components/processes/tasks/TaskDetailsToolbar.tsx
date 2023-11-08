'use client';

import { useState } from 'react';
import { cx } from 'classix';
import { Delete, MoreHorizontal } from '@signalco/ui-icons';
import { Row } from '@signalco/ui/dist/Row';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { SavingIndicator } from '../../shared/SavingIndicator';
import { useProcessTaskDefinition } from '../../../src/hooks/useProcessTaskDefinition';
import { TaskDeleteModal } from './TaskDeleteModal';

type TaskDetailsToolbarProps = {
    processId: string;
    selectedTaskId: string | undefined;
    saving: boolean;
};

export function TaskDetailsToolbar({ processId, selectedTaskId, saving }: TaskDetailsToolbarProps) {
    const { data: taskDefinition } = useProcessTaskDefinition(processId, selectedTaskId);
    const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);

    return (
        <>
            <Row className="p-2">
                <div className="grow"></div>
                <SavingIndicator saving={saving} />
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        className={cx('transition-opacity opacity-0', taskDefinition && 'opacity-100')}>
                        <IconButton
                            variant="plain"
                            title="Task options...">
                            <MoreHorizontal />
                        </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteTaskOpen(true)}>
                            Delete...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Row>
            {taskDefinition && (
                <TaskDeleteModal
                    taskDefinition={taskDefinition}
                    open={deleteTaskOpen}
                    onOpenChange={setDeleteTaskOpen} />
            )}
        </>
    );
}
