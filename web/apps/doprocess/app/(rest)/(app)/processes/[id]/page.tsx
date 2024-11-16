import { cx } from '@signalco/ui-primitives/cx';
import { TaskDetails } from '../../../../../components/processes/tasks/TaskDetails';

export default async function ProcessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const editable = true;
    return (
        <div className={cx(!editable && 'py-10')}>
            <TaskDetails processId={id} editable={editable} />
        </div>
    );
}
