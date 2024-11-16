'use client';

import { useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Popper } from '@signalco/ui-primitives/Popper';
import { ListItem } from '@signalco/ui-primitives/ListItem';
import { List } from '@signalco/ui-primitives/List';
import { Card, CardContent } from '@signalco/ui-primitives/Card';
import { Empty, FileInput, FileText } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';
import { useDocuments } from '../../../src/hooks/useDocuments';

export default function TaskDetailsTypePicker({ processId, taskDefinitionId, onPicked }: { processId: string, taskDefinitionId: string, onPicked?: (type: string, typeData?: string) => void }) {
    const taskDefinitionUpdate = useProcessTaskDefinitionUpdate();

    const handleTypePicked = async (type: string, typeData?: string) => {
        await taskDefinitionUpdate.mutateAsync({
            processId,
            taskDefinitionId,
            type,
            typeData
        });
        onPicked?.(type, typeData);
    }

    const [selectDocumentOpen, setSelectDocumentOpen] = useState(false);
    const {data: documents, isLoading: isDocumentsLoading, error: documentsError} = useDocuments(selectDocumentOpen);

    return (
        <section className="flex flex-col gap-2">
            <Typography>Choose task type</Typography>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="flex h-full items-center" onClick={() => handleTypePicked('blank')}>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <div className="size-6">
                                <Empty className="size-6 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                                <Typography>Empty</Typography>
                                <Typography level="body2" secondary>No additional content</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex h-full items-center" onClick={() => handleTypePicked('document')}>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <div className="size-6">
                                <FileText className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                                <Typography>New Document</Typography>
                                <Typography level="body2" secondary>Create a new document</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Popper
                    open={selectDocumentOpen}
                    onOpenChange={setSelectDocumentOpen}
                    trigger={(
                        <Card className="flex h-full items-center">
                            <CardContent className="px-4 py-2">
                                <div className="flex items-center space-x-4">
                                    <div className="size-6">
                                        <FileInput className="text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <Typography>Link Existing Document</Typography>
                                        <Typography level="body2" secondary>Use an existing document for this task</Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}>
                    <Loadable
                        loadingLabel="Loading documents..."
                        isLoading={isDocumentsLoading}
                        error={documentsError}
                    >
                        <List>
                            {documents?.map((document) => (
                                <ListItem
                                    key={document.id}
                                    nodeId={document.id}
                                    onSelected={() => handleTypePicked('document', document.id)}
                                    label={document.name} />
                            ))}
                        </List>
                    </Loadable>
                </Popper>
            </div>
        </section>
    );
}
