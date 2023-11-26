'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Skeleton } from '@signalco/ui-primitives/Skeleton';
import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { cx } from '@signalco/ui-primitives/cx';
import { Empty, FileText } from '@signalco/ui-icons';
import { TypographyEditable } from '@signalco/ui/TypographyEditable';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { TypographyDocumentName } from '../documents/TypographyDocumentName';
import { EditorSkeleton } from '../documents/editor/EditorSkeleton';
import { DocumentSharedWithIndicator } from '../documents/DocumentSharedWithIndicator';
import { KnownPages } from '../../../src/knownPages';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';
import { useProcessTaskDefinition } from '../../../src/hooks/useProcessTaskDefinition';
import TaskDetailsTypePicker from './TaskDetailsTypePicker';
import { TaskDetailsToolbar } from './TaskDetailsToolbar';

const DocumentEditor = dynamic(() => import('../documents/DocumentEditor').then(mod => mod.DocumentEditor), { ssr: false, loading: () => <EditorSkeleton /> });

type TaskDetailsProps = {
    processId: string;
    editable: boolean;
};

export function TaskDetails({ processId, editable }: TaskDetailsProps) {
    const [selectedTaskId] = useSearchParam('task');
    const { data: taskDefinition, isLoading: taskDefinitionIsLoading, error: taskDefinitionError } = useProcessTaskDefinition(processId, selectedTaskId);

    const taskDefinitionUpdate = useProcessTaskDefinitionUpdate();
    const handleHeaderChange = async (text: string) => {
        if (selectedTaskId) {
            await taskDefinitionUpdate.mutateAsync({
                processId,
                taskDefinitionId: selectedTaskId,
                text
            });
        }
    }
    const headerOrDefault = taskDefinition?.text ?? '';
    const hasHeader = headerOrDefault.length > 0;
    const header = hasHeader ? headerOrDefault : 'No description';

    const [saving, setSaving] = useState(false);

    if (taskDefinition === null && !taskDefinitionIsLoading) {
        return (
            <div className="p-4 text-center opacity-60">
                <p className="text-2xl font-semibold">Task not found</p>
                <p className="text-sm">The task you are trying to access does not exist.</p>
            </div>
        );
    }

    return (
        <Stack spacing={2} className="h-full overflow-x-hidden">
            <TaskDetailsToolbar
                processId={processId}
                selectedTaskId={selectedTaskId}
                saving={saving}
                editable={editable} />
            {selectedTaskId === undefined && (
                <div className="mt-4 flex items-center justify-center text-xl text-muted-foreground">
                    No task selected.
                </div>
            )}
            {(taskDefinition === null && !taskDefinitionIsLoading) && (
                <div className="flex items-center justify-center text-xl text-muted-foreground">
                    Task not found.
                </div>
            )}
            {selectedTaskId && (
                <Loadable
                    isLoading={taskDefinitionIsLoading}
                    loadingLabel="Loading task details..."
                    error={taskDefinitionError}
                    placeholder={(
                        <>
                            <Skeleton className="mx-[62px] h-12 w-[250px]" />
                            <EditorSkeleton />
                        </>
                    )}>
                    <Stack className={'px-[62px]'}>
                        {editable ? (
                            <TypographyEditable
                                level="h2"
                                className={cx(!hasHeader && 'text-muted-foreground hover:text-foreground')}
                                onChange={handleHeaderChange}>
                                {header}
                            </TypographyEditable>
                        ) : (
                            <Typography level="h2">{header}</Typography>
                        )}
                        {taskDefinition?.type && (
                            <Row spacing={1}>
                                {taskDefinition.type === 'blank' && (
                                    <>
                                        <Empty className="opacity-60" width={16} />
                                        <Typography level="body2">Blank - No details</Typography>
                                    </>
                                )}
                                {taskDefinition.type === 'document' && (
                                    <Link href={taskDefinition.typeData ? KnownPages.Document(taskDefinition.typeData) : '#'}>
                                        <FileText className="opacity-60" width={16} />
                                    </Link>
                                )}
                                {taskDefinition.type === 'document' && taskDefinition.typeData && (
                                    <>
                                        <TypographyDocumentName
                                            level="body2"
                                            id={taskDefinition.typeData}
                                            editable={editable} />
                                        <DocumentSharedWithIndicator documentId={taskDefinition.typeData} />
                                    </>
                                )}
                            </Row>
                        )}
                    </Stack>
                    {(taskDefinition?.type === 'document' && taskDefinition?.typeData) && (
                        <DocumentEditor
                            id={taskDefinition.typeData}
                            editable={editable}
                            onSavingChange={setSaving} />
                    )}
                    {(editable && (!taskDefinition?.type || !taskDefinition.typeData)) && (
                        <div className="px-[62px]">
                            {taskDefinition && (
                                <TaskDetailsTypePicker
                                    processId={processId}
                                    taskDefinitionId={taskDefinition.id.toString()} />
                            )}
                        </div>
                    )}
                </Loadable>
            )}
        </Stack>
    );
}
