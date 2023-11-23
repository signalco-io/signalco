'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { TypographyEditable, TypographyEditableProps } from '@signalco/ui/TypographyEditable';
import { Loadable } from '@signalco/ui/Loadable';
import { useDocumentUpdate } from '../../../src/hooks/useDocumentUpdate';
import { useDocument } from '../../../src/hooks/useDocument';

export type TypographyDocumentNameProps = Omit<TypographyEditableProps, 'children' | 'onChange'> & {
    id: string | undefined;
    placeholderHeight?: number;
    placeholderWidth?: number;
    editable?: boolean;
};

export function TypographyDocumentName({ id, placeholderWidth, placeholderHeight, editable, ...rest }: TypographyDocumentNameProps) {
    const { data: document, isLoading, error } = useDocument(id);

    const processUpdate = useDocumentUpdate();
    const handleDocumentRename = async (name: string) => {
        if (!id) return;

        await processUpdate.mutateAsync({
            id,
            name
        });
    }
    const documentNameMutatedOrDefault = (processUpdate.variables?.name ?? document?.name) ?? '';

    if (document === null && !isLoading) {
        return (
            <Typography secondary {...rest}>Document not found</Typography>
        );
    }

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading document..."
            placeholder="skeletonRect"
            error={error}
            width={placeholderWidth}
            height={placeholderHeight}>
            {editable ? (
                <TypographyEditable title={documentNameMutatedOrDefault} onChange={handleDocumentRename} {...rest}>{documentNameMutatedOrDefault}</TypographyEditable>
            ) : (<Typography title={documentNameMutatedOrDefault} {...rest}>{documentNameMutatedOrDefault}</Typography>)}
        </Loadable>
    );
}
