'use client';

import { QueryList } from '@signalco/ui/QueryList';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { SignedOut, SignedIn } from '@signalco/auth-client/components';
import { InAppCtaSignUp } from '../../shared/InAppCtaSignUp';
import { useProcessRuns } from '../../../src/hooks/useProcessRuns';
import { useProcessesRuns } from '../../../src/hooks/useProcessesRuns';
import { RunsListItem } from './RunsListItem';
import { RunsListEmptyPlaceholder } from './RunsListEmptyPlaceholder';
import { ProcessRunCreateForm } from './ProcessRunCreateForm';

export function RunsList({ processId }: { processId?: string }) {
    const [showComplated] = useSearchParam('show-completed');
    const processRuns = useProcessRuns(processId, showComplated === 'true' ? 'completed' : 'running');
    const processesRuns = useProcessesRuns(!processId, showComplated === 'true' ? 'completed' : 'running');

    return (
        <>
            <SignedIn>
                <QueryList
                    query={() => processId ? processRuns : processesRuns}
                    itemRender={(item) => (<RunsListItem run={item} />)}
                    editable={Boolean(processId) && showComplated !== 'true'}
                    itemCreateLabel="New process run"
                    variant="outlined"
                    createForm={processId ? <ProcessRunCreateForm processId={processId} redirect /> : undefined}
                    emptyPlaceholder={<RunsListEmptyPlaceholder showCompleted={showComplated === 'true'} />}
                />
            </SignedIn>
            <SignedOut>
                <InAppCtaSignUp />
            </SignedOut>
        </>
    );
}
