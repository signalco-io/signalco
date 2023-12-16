import { cx } from '@signalco/ui-primitives/cx';
import { TaskDetails } from '../../../../../components/processes/tasks/TaskDetails';

export default function ProcessPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const editable = true;
    return (
        <div className={cx(!editable && 'py-10')}>
            <TaskDetails processId={id} editable={editable} />
        </div>
    );
}
