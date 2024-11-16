import { RunsListView } from '../../../../../../components/processes/processes/RunsListView';

export default async function ProcessRunsPage({ params }: { params: Promise<{ id: string }> }) {
    const processId = (await params).id;
    return <RunsListView processId={processId} />
}
