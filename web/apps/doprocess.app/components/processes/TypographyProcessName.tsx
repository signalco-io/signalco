'use client';

import { useEffect, useState } from 'react';
import { TypographyEditable, TypographyEditableProps } from '@signalco/ui/dist/TypographyEditable';
import { Typography } from '@signalco/ui/dist/Typography';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useProcessUpdate } from '../../src/hooks/useProcessUpdate';
import { useProcess } from '../../src/hooks/useProcess';

export type TypographyProcessNameProps = Omit<TypographyEditableProps, 'children' | 'onChange'> & {
    id: string | undefined;
    placeholderHeight?: number;
    placeholderWidth?: number;
    editable?: boolean;
};

export function TypographyProcessName({ id, placeholderWidth, placeholderHeight, editable, ...rest }: TypographyProcessNameProps) {
    const { data: process, isLoading, error } = useProcess(id);

    const [processName, setProcessName] = useState(process?.name ?? '');
    useEffect(() => {
        setProcessName(process?.name ?? '');
    }, [process]);
    const processUpdate = useProcessUpdate();
    const handleProcessRename = async (name: string) => {
        if (!id) return;

        setProcessName(name);
        await processUpdate.mutateAsync({
            processId: id,
            name
        });
    }

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading process..."
            placeholder="skeletonText"
            error={error}
            width={placeholderWidth}
            height={placeholderHeight}>
            {editable ? (
                <TypographyEditable onChange={handleProcessRename} {...rest}>{processName}</TypographyEditable>
            ) : (<Typography {...rest}>{processName}</Typography>)}
        </Loadable>
    );
}
