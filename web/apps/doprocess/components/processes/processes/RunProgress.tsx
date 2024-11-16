'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Progress } from '@signalco/ui-primitives/Progress';
import { Check } from '@signalco/ui-icons';
import { Loadable } from '@signalco/ui/Loadable';
import { useProcessTaskDefinitions } from '../../../src/hooks/useProcessTaskDefinitions';
import { useProcessRunTasks } from '../../../src/hooks/useProcessRunTasks';

type RunProgressProps = {
    processId: string;
    runId: string;
    hideLabel?: boolean;
};

export function RunProgress({ processId, runId, hideLabel }: RunProgressProps) {
    const { data: taskDefinitions, isLoading: taskDefinitionsLoading } = useProcessTaskDefinitions(processId);
    const { data: tasks, isLoading: tasksLoading } = useProcessRunTasks(processId, runId);

    const completedCount = tasks?.filter(t => t.state === 'completed').length ?? 0;
    const totalCount = taskDefinitions?.length ?? 0;
    const progress = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;
    const isComplete = progress >= 100;

    return (
        <Loadable
            isLoading={taskDefinitionsLoading || tasksLoading}
            placeholder="skeletonRect"
            width={hideLabel ? 80 : 110}
            height={16}
            loadingLabel={'Loading progress...'}>
            <Row spacing={0.5} title={`Completed: ${completedCount} out of ${totalCount}`}>
                {isComplete ? (
                    <>
                        <Typography level="body3">Completed</Typography>
                        <Check size={18} className="text-green-600" />
                    </>
                ) : (
                    <>
                        {!hideLabel && (
                            <Typography level="body3">{Math.round(progress)}%</Typography>
                        )}
                        <Progress value={progress} className="h-2 w-20" />
                    </>
                )}
            </Row>
        </Loadable>
    );
}
