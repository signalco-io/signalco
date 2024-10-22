import { TaskDetails } from '../../../../../../../components/processes/tasks/TaskDetails';

export default async function ProcessRunPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <TaskDetails processId={id} editable={false} />
    );
}
