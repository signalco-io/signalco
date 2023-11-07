'use client';

import { Empty, Text, TextLinked } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Card, CardContent } from '@signalco/ui/dist/Card';

export default function TaskDetailsTypePicker() {
    const handleTypePicked = (type: string) => {

    }

    return (
        <section className="flex flex-col gap-2">
            <Typography level="h5">Choose Task Type</Typography>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="flex h-full items-center" onClick={() => handleTypePicked('blank')}>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <Empty className="text-gray-500 dark:text-gray-400" />
                            <div>
                                <Typography>Empty</Typography>
                                <Typography level="body2" secondary>Start from scratch</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex h-full items-center" onClick={() => handleTypePicked('document')}>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <Text className="text-gray-500 dark:text-gray-400" />
                            <div>
                                <Typography>New Document</Typography>
                                <Typography level="body2" secondary>Create a new document</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex h-full items-center" onClick={() => handleTypePicked('document')}>
                    <CardContent className="px-4 py-2">
                        <div className="flex items-center space-x-4">
                            <TextLinked className="text-gray-500 dark:text-gray-400" />
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
