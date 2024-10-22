import { SplitView } from '@signalco/ui/SplitView';
import { TaskDetails } from '../../../../../components/processes/tasks/TaskDetails';
import { ProcessDetails } from '../../../../../components/processes/processes/ProcessDetails';

export default async function ProcessEmbeddedPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const editable = false;
    return (
        <SplitView>
            <div className="p-2">
                <ProcessDetails id={id} editable={editable} />
            </div>
            <div className="h-full p-2">
                <TaskDetails processId={id} editable={editable} />
            </div>
        </SplitView>
    );
}
