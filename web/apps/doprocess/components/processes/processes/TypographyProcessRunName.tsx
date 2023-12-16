'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { TypographyEditable, TypographyEditableProps } from '@signalco/ui/TypographyEditable';
import { Loadable } from '@signalco/ui/Loadable';
import { useProcessRunUpdate } from '../../../src/hooks/useProcessRunUpdate';
import { useProcessRun } from '../../../src/hooks/useProcessRun';

export type TypographyProcessRunNameProps = Omit<TypographyEditableProps, 'children' | 'onChange'> & {
    id: string | undefined;
    runId: string | undefined;
    placeholderHeight?: number;
    placeholderWidth?: number;
    editable?: boolean;
};

export function TypographyProcessRunName({ id, runId, placeholderWidth, placeholderHeight, editable, ...rest }: TypographyProcessRunNameProps) {
    const { data: processRun, isLoading, error } = useProcessRun(id, runId);

    const processRunUpdate = useProcessRunUpdate();
    const handleProcessRunRename = async (name: string) => {
        if (!id || !runId) return;

        await processRunUpdate.mutateAsync({
            processId: id,
            runId: runId,
            name
        });
    }
    const processRunNameMutatedOrDefault = (processRunUpdate.variables?.name ?? processRun?.name) ?? '';

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading process..."
            placeholder="skeletonText"
            error={error}
            width={placeholderWidth}
            height={placeholderHeight}>
            {editable ? (
                <TypographyEditable title={processRunNameMutatedOrDefault} onChange={handleProcessRunRename} {...rest}>{processRunNameMutatedOrDefault}</TypographyEditable>
            ) : (<Typography title={processRunNameMutatedOrDefault} {...rest}>{processRunNameMutatedOrDefault}</Typography>)}
        </Loadable>
    );
}
