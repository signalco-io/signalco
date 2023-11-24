'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { TypographyEditable, TypographyEditableProps } from '@signalco/ui/TypographyEditable';
import { Loadable } from '@signalco/ui/Loadable';
import { useProcessUpdate } from '../../../src/hooks/useProcessUpdate';
import { useProcess } from '../../../src/hooks/useProcess';

export type TypographyProcessNameProps = Omit<TypographyEditableProps, 'children' | 'onChange'> & {
    id: string | undefined;
    placeholderHeight?: number;
    placeholderWidth?: number;
    editable?: boolean;
};

export function TypographyProcessName({ id, placeholderWidth, placeholderHeight, editable, ...rest }: TypographyProcessNameProps) {
    const { data: process, isLoading, error } = useProcess(id);

    const processUpdate = useProcessUpdate();
    const handleProcessRename = async (name: string) => {
        if (!id) return;

        await processUpdate.mutateAsync({
            processId: id,
            name
        });
    }
    const processNameMutatedOrDefault = (processUpdate.variables?.name ?? process?.name) ?? '';

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading process..."
            placeholder="skeletonText"
            error={error}
            width={placeholderWidth}
            height={placeholderHeight}>
            {editable ? (
                <TypographyEditable title={processNameMutatedOrDefault} onChange={handleProcessRename} {...rest}>{processNameMutatedOrDefault}</TypographyEditable>
            ) : (<Typography title={processNameMutatedOrDefault} {...rest}>{processNameMutatedOrDefault}</Typography>)}
        </Loadable>
    );
}
