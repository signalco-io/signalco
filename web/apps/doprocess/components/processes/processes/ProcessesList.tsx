'use client';

import { QueryList } from '@signalco/ui/QueryList';
import { SignedOut, SignedIn } from '@signalco/auth-client/components';
import { InAppCtaSignUp } from '../../shared/InAppCtaSignUp';
import { useProcesses } from '../../../src/hooks/useProcesses';
import { ProcessesListItem } from './ProcessesListItem';
import { ProcessCreateForm } from './ProcessCreateForm';

export function ProcessesList() {
    return (
        <>
            <SignedIn>
                <QueryList
                    query={useProcesses}
                    itemRender={(item) => (<ProcessesListItem process={item} />)}
                    editable
                    itemCreateLabel="New process"
                    variant="outlined"
                    createForm={<ProcessCreateForm redirect />} />
            </SignedIn>
            <SignedOut>
                <InAppCtaSignUp />
            </SignedOut>
        </>
    );
}
