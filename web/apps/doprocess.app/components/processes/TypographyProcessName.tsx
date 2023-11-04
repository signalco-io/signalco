'use client';

import { Typography, TypographyProps } from '@signalco/ui/dist/Typography';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useProcess } from '../../src/hooks/useProcess';

export type TypographyProcessNameProps = Omit<TypographyProps, 'children'> & {
    id: string | undefined;
    placeholderHeight?: number;
    placeholderWidth?: number;
};

export function TypographyProcessName({ id, placeholderWidth, placeholderHeight, ...rest }: TypographyProcessNameProps) {
    const { data: process, isLoading, error } = useProcess(id);

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading process..."
            placeholder="skeletonText"
            error={error}
            width={placeholderWidth}
            height={placeholderHeight}>
            <Typography {...rest}>{process?.name ?? ''}</Typography>
        </Loadable>
    );
}
