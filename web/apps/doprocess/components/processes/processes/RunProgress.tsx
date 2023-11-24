import { Typography } from '@signalco/ui-primitives/Typography';
import { Tooltip } from '@signalco/ui-primitives/Tooltip';
import { Row } from '@signalco/ui-primitives/Row';
import { Progress } from '@signalco/ui-primitives/Progress';
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

    return (
        <Loadable
            isLoading={taskDefinitionsLoading || tasksLoading}
            placeholder="skeletonRect"
            width={hideLabel ? 80 : 110}
            height={16}
            loadingLabel={'Loading progress...'}>
            <Row spacing={1}>
                {!hideLabel && (
                    <Tooltip title={`Completed: ${completedCount} out of ${totalCount}`}>
                        <Typography level="body3" secondary>{Math.round(progress)}%</Typography>
                    </Tooltip>
                )}
                <Progress value={progress} className="h-2 w-20" />
            </Row>
        </Loadable>
    );
}
