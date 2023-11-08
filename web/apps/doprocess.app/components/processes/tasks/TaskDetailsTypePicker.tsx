'use client';

import { Empty, Text, TextLinked } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Card, CardContent } from '@signalco/ui/dist/Card';
import { useProcessTaskDefinitionUpdate } from '../../../src/hooks/useProcessTaskDefinitionUpdate';

export default function TaskDetailsTypePicker({ processId, taskDefinitionId }: { processId: string, taskDefinitionId: string }) {
    const taskDefinitionUpdate = useProcessTaskDefinitionUpdate();

    const handleTypePicked = async (type: string) => {
        await taskDefinitionUpdate.mutateAsync({
            processId,
            taskDefinitionId,
            type
        });
    }

    return (
        <section className="flex flex-col gap-2">
            <Typography>Choose task type</Typography>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="flex h-full items-center" onClick={() => handleTypePicked('blank')}>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <div className="h-6 w-6">
                                <Empty className="h-6 w-6 text-gray-500 dark:text-gray-400" />
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
                            <div className="h-6 w-6">
                                <Text className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                                <Typography>New Document</Typography>
                                <Typography level="body2" secondary>Create a new document</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex h-full items-center" onClick={() => {}}>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <div className="h-6 w-6">
                                <TextLinked className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                                <Typography>Link Existing Document</Typography>
                                <Typography level="body2" secondary>Use an existing document for this task</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
