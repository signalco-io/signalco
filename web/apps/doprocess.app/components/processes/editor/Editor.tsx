'use client';

import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import { PartialBlock } from '@blocknote/core';

type EditorProps = {
    id: string | undefined,
    editable: boolean;
    content: string;
    onChange?: (value: string) => void;
};

export function Editor({ id, content, editable, onChange }: EditorProps) {
    const editor = useBlockNote({
        editable,
        initialContent: JSON.parse(content ?? '[]') as PartialBlock[],
        onEditorContentChange: (editor) => {
            onChange?.(JSON.stringify(editor.topLevelBlocks));
        },
    }, [id, onChange, editable]);

    return (
        <div className="p-2">
            <BlockNoteView editor={editor} theme="light" />
        </div>
    );
}
