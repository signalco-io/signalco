'use client';

import { TypographyEditable, TypographyEditableProps } from '@signalco/ui/dist/TypographyEditable';
import { Typography } from '@signalco/ui/dist/Typography';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useDocumentUpdate } from '../../../src/hooks/useDocumentUpdate';
import { useDocument } from '../../../src/hooks/useDocument';

export type TypographyDocumentNameProps = Omit<TypographyEditableProps, 'children' | 'onChange'> & {
    id: string | undefined;
    placeholderHeight?: number;
    placeholderWidth?: number;
    editable?: boolean;
};

export function TypographyDocumentName({ id, placeholderWidth, placeholderHeight, editable, ...rest }: TypographyDocumentNameProps) {
    const { data: process, isLoading, error } = useDocument(id);

    const processUpdate = useDocumentUpdate();
    const handleDocumentRename = async (name: string) => {
        if (!id) return;

        await processUpdate.mutateAsync({
            id,
            name
        });
    }
    const documentNameMutatedOrDefault = (processUpdate.variables?.name ?? process?.name) ?? '';

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading document..."
            placeholder="skeletonText"
            error={error}
            width={placeholderWidth}
            height={placeholderHeight}>
            {editable ? (
                <TypographyEditable onChange={handleDocumentRename} {...rest}>{documentNameMutatedOrDefault}</TypographyEditable>
            ) : (<Typography {...rest}>{documentNameMutatedOrDefault}</Typography>)}
        </Loadable>
    );
}
