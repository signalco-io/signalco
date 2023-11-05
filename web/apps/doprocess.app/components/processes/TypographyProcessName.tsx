'use client';

import { TypographyEditable, TypographyEditableProps } from '@signalco/ui/dist/TypographyEditable';
import { Typography } from '@signalco/ui/dist/Typography';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useProcess } from '../../src/hooks/useProcess';

export type TypographyProcessNameProps = Omit<TypographyEditableProps, 'children'> & {
    id: string | undefined;
    placeholderHeight?: number;
    placeholderWidth?: number;
    editable?: boolean;
};

export function TypographyProcessName({ id, placeholderWidth, placeholderHeight, editable, onChange, ...rest }: TypographyProcessNameProps) {
    const { data: process, isLoading, error } = useProcess(id);

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading process..."
            placeholder="skeletonText"
            error={error}
            width={placeholderWidth}
            height={placeholderHeight}>
            {editable ? (
                <TypographyEditable onChange={onChange} {...rest}>{process?.name ?? ''}</TypographyEditable>
            ) : (
                <Typography {...rest}>{process?.name ?? ''}</Typography>
            )}
        </Loadable>
    );
}
