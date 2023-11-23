'use client';

import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Delete, MoreHorizontal } from '@signalco/ui-icons';
import { Toolbar } from '../../shared/Toolbar';
import { SavingIndicator } from '../../shared/SavingIndicator';
import { useProcessTaskDefinition } from '../../../src/hooks/useProcessTaskDefinition';
import { TaskDeleteModal } from './TaskDeleteModal';

type TaskDetailsToolbarProps = {
    processId: string;
    selectedTaskId: string | undefined;
    saving: boolean;
    editable: boolean;
};

export function TaskDetailsToolbar({ processId, selectedTaskId, saving, editable }: TaskDetailsToolbarProps) {
    const { data: taskDefinition } = useProcessTaskDefinition(processId, selectedTaskId);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <Toolbar>
                <SavingIndicator saving={saving} />
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        className={cx('transition-opacity opacity-0', (editable && taskDefinition) && 'opacity-100')}>
                        <IconButton
                            variant="plain"
                            title="Task options...">
                            <MoreHorizontal />
                        </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteOpen(true)}>
                            Delete...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Toolbar>
            {taskDefinition && (
                <TaskDeleteModal
                    taskDefinition={taskDefinition}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen} />
            )}
        </>
    );
}
