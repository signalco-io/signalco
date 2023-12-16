import { TaskDetails } from '../../../../../../../components/processes/tasks/TaskDetails';

export default function ProcessRunPage({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        <TaskDetails processId={id} editable={false} />
    );
}
