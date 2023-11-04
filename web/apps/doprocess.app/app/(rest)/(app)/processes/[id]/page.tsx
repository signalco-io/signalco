'use client';

import { cx } from 'classix';
import { Stack } from '@signalco/ui/dist/Stack';
import { Breadcrumbs } from '@signalco/ui/dist/Breadcrumbs';
import { KnownPages } from '../../../../../src/knownPages';
import { TypographyProcessName } from '../../../../../components/processes/TypographyProcessName';
import { TaskDetails } from '../../../../../components/processes/tasks/TaskDetails';
import { ProcessDetails } from '../../../../../components/processes/ProcessDetails';
import { SplitView } from '../../../../../components/layouts/SplitView';

export default function ProcessPage({ params }: { params: { id: string } }) {
    const editable = true;
    return (
        <SplitView minSize={230}>
            <Stack spacing={1} className="p-2">
                <Breadcrumbs
                    endSeparator
                    items={[
                        { label: 'Processes', href: KnownPages.Processes },
                        { label: <TypographyProcessName id={params.id} />, href: KnownPages.Process(params.id) }
                    ]} />
                <ProcessDetails id={params.id} editable={editable} />
            </Stack>
            <div className={cx(!editable && 'py-10')}>
                <TaskDetails processId={params.id} editable={editable} />
            </div>
        </SplitView>
    );
}
