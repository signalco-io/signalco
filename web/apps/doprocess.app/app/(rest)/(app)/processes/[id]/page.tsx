import { cx } from 'classix';
import { TaskDetails } from '../../../../../components/processes/tasks/TaskDetails';

export default function ProcessPage({ params }: { params: { id: string } }) {
    const editable = true;
    return (
        <div className={cx(!editable && 'py-10')}>
            <TaskDetails processId={params.id} editable={editable} />
        </div>
    );
}
