import { TaskDetails } from '../../../../components/processes/TaskDetails';
import { ProcessDetails } from '../../../../components/processes/ProcessDetails';
import { SplitView } from '../../../../components/layouts/SplitView';

export default function ProcessPage({ params }: { params: { id: string } }) {
    const editable = true;
    return (
        <SplitView>
            <div className="p-2">
                <ProcessDetails id={params.id} editable={editable} />
            </div>
            <div className="p-2">
                <TaskDetails processId={params.id} editable={editable} />
            </div>
        </SplitView>
    );
}
