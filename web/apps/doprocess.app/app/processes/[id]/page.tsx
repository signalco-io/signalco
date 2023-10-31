import { TaskDetails } from '../../../components/processes/TaskDetails';
import { ProcessDetails } from '../../../components/processes/ProcessDetails';
import { SplitView } from '../../../components/layouts/SplitView';

export default function ProcessPage({ params }: { params: { id: string } }) {
    return (
        <SplitView>
            <ProcessDetails id={params.id} />
            <TaskDetails processId={params.id} />
        </SplitView>
    );
}
