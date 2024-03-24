import { SplitView } from '@signalco/ui/SplitView';
import { TaskDetails } from '../../../../../components/processes/tasks/TaskDetails';
import { ProcessDetails } from '../../../../../components/processes/processes/ProcessDetails';

export default function ProcessEmbeddedPage({ params }: { params: { id: string } }) {
    const editable = false;
    return (
        <SplitView>
            <div className="p-2">
                <ProcessDetails id={params.id} editable={editable} />
            </div>
            <div className="h-full p-2">
                <TaskDetails processId={params.id} editable={editable} />
            </div>
        </SplitView>
    );
}
