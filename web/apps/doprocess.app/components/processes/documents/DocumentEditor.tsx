'use client';

import { useEffect, useRef, useState } from 'react';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { useDebouncedEffect } from '@enterwell/react-hooks';
import { EditorSkeleton } from '../editor/EditorSkeleton';
import { Editor } from '../editor/Editor';
import { useDocumentUpdate } from '../../../src/hooks/useDocumentUpdate';
import { useDocument } from '../../../src/hooks/useDocument';

export type DocumentEditorProps = {
    id: string;
    editable?: boolean;
    onSavingChange?: (saving: boolean) => void;
};

export function DocumentEditor({ id, editable, onSavingChange }: DocumentEditorProps) {
    const { data: document, isLoading, error } = useDocument(id);
    const documentUpdate = useDocumentUpdate();
    const documentData = document?.data as string | null | undefined;

    const currentContentId = useRef<string>();
    const [content, setContent] = useState<string | null>();
    useEffect(() => {
        if (!isLoading && !error && currentContentId.current !== id) {
            console.debug('Document ID changed', currentContentId.current, '>', id)
            setContent(documentData ?? '[]');
            currentContentId.current = id;
        }
    }, [id, isLoading, error, documentData, content]);
    useDebouncedEffect(() => {
        if (!content || documentData === content) {
            return;
        }
        (async () => {
            console.debug('Saving document changed...');
            onSavingChange?.(true);
            try {
                await documentUpdate.mutateAsync({
                    id,
                    data: content
                });
            } catch(err) {
                // TODO: Show error notification
            } finally{
                onSavingChange?.(false);
            }
        })();
    }, [content, id], 1000);

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading document..."
            placeholder={<EditorSkeleton />}
            error={error}>
            {content && (
                <Editor
                    id={currentContentId.current}
                    content={content}
                    editable={editable}
                    onChange={setContent} />
            )}
        </Loadable>
    );
}
