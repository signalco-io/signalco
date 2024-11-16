'use client';

import { useEffect, useRef, useState } from 'react';
import { showNotification } from '@signalco/ui-notifications';
import { Loadable } from '@signalco/ui/Loadable';
import { useDebouncedEffect } from '@enterwell/react-hooks';
import { useDocumentUpdate } from '../../../src/hooks/useDocumentUpdate';
import { useDocument } from '../../../src/hooks/useDocument';
import { EditorSkeleton } from './editor/EditorSkeleton';
import { Editor } from './editor/Editor';

export type DocumentEditorProps = {
    id: string;
    editable?: boolean;
    onSavingChange?: (saving: boolean) => void;
};

export function DocumentEditor({ id, editable, onSavingChange }: DocumentEditorProps) {
    const { data: document, isLoading, error } = useDocument(id);
    const documentUpdate = useDocumentUpdate();
    const documentData = document?.dataJson;

    const currentContentId = useRef<string>(null);
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
            } catch {
                showNotification('Failed to save document', 'error');
            } finally{
                onSavingChange?.(false);
            }
        })();
    }, [content, id], 1000);

    if (document === null && !isLoading) {
        return (
            <div className="pt-8 text-center opacity-60">
                <p className="text-2xl font-semibold">Document not found</p>
                <p className="text-sm">The document you are trying to access does not exist.</p>
            </div>
        );
    }

    return (
        <Loadable
            isLoading={isLoading}
            loadingLabel="Loading document..."
            placeholder={<EditorSkeleton />}
            error={error}>
            {content && currentContentId.current && (
                <Editor
                    id={currentContentId.current}
                    content={content}
                    editable={editable}
                    onChange={setContent} />
            )}
        </Loadable>
    );
}
