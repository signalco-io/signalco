import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui/dist/Stack';
import { Breadcrumbs } from '@signalco/ui/dist/Breadcrumbs';
import { KnownPages } from '../../../../../src/knownPages';
import { ProcessDetails } from '../../../../../components/processes/ProcessDetails';
import { SplitView } from '../../../../../components/layouts/SplitView';

export default function ProcessLayout({ children, params }: PropsWithChildren<{ params: { id: string } }>) {
    const editable = true;
    return (
        <SplitView minSize={230}>
            <Stack spacing={1} className="p-2">
                <Breadcrumbs
                    endSeparator
                    items={[
                        { label: 'Processes', href: KnownPages.Processes },
                    ]} />
                <ProcessDetails id={params.id} editable={editable} />
            </Stack>
            {children}
        </SplitView>
    );
}
