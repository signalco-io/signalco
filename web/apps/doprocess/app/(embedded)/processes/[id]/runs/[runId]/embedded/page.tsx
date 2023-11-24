import { TaskDetails } from '../../../../../../../components/processes/tasks/TaskDetails';
import { ProcessDetails } from '../../../../../../../components/processes/processes/ProcessDetails';
import { SplitView } from '../../../../../../../components/layouts/SplitView';

export default function ProcessEmbeddedPage({ params }: { params: { id: string, runId: string } }) {
    const { id, runId } = params;
    const editable = false;
    return (
        <SplitView>
            <div className="p-2">
                <ProcessDetails id={id} runId={runId} editable={editable} />
            </div>
            <div className="h-full p-2">
                <TaskDetails processId={id} editable={editable} />
            </div>
        </SplitView>
    );
}
