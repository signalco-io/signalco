'use client';

import { useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Modal } from '@signalco/ui-primitives/Modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@signalco/ui-primitives/Menu';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { cx } from '@signalco/ui-primitives/cx';
import { Delete, MoreHorizontal, Replace } from '@signalco/ui-icons';
import { Toolbar } from '../../shared/Toolbar';
import { SavingIndicator } from '../../shared/SavingIndicator';
import { useProcessTaskDefinition } from '../../../src/hooks/useProcessTaskDefinition';
import TaskDetailsTypePicker from './TaskDetailsTypePicker';
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
    const [typePickerOpen, setTypePickerOpen] = useState(false);

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
                        <DropdownMenuItem startDecorator={<Replace />} onClick={() => setTypePickerOpen(true)}>
                            Change type...
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteOpen(true)}>
                            Delete...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Toolbar>
            {taskDefinition && (
                <TaskDeleteModal
                    title="Delete task definition"
                    taskDefinition={taskDefinition}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen} />
            )}
            {typePickerOpen && selectedTaskId && (
                <Modal title="Change task type" open={typePickerOpen} onOpenChange={setTypePickerOpen}>
                    <Stack spacing={1}>
                        <Typography level="h5">Change task type</Typography>
                        <TaskDetailsTypePicker
                            processId={processId}
                            taskDefinitionId={selectedTaskId}
                            onPicked={() => setTypePickerOpen(false)}
                        />
                    </Stack>
                </Modal>
            )}
        </>
    );
}
