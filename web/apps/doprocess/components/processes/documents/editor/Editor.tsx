'use client';

import { useTheme } from 'next-themes';
import { BlockNoteView, Theme, useBlockNote, darkDefaultTheme } from '@blocknote/react';
import '@blocknote/core/style.css';
import { PartialBlock } from '@blocknote/core';

type EditorProps = {
    id: string | undefined,
    editable?: boolean;
    content: string;
    onChange?: (value: string) => void;
};

const customDarkTheme = {
    ...darkDefaultTheme,
    colors: {
        ...darkDefaultTheme.colors,
        editor: {
            text: 'var(--foreground)',
            background: 'var(--background)',
        },
    }
} satisfies Theme;

export function Editor({ id, content, editable, onChange }: EditorProps) {
    const { resolvedTheme } = useTheme();
    const editor = useBlockNote({
        editable: editable ?? false,
        initialContent: JSON.parse(content ?? '[]') as PartialBlock[],
        onEditorContentChange: (editor) => {
            onChange?.(JSON.stringify(editor.topLevelBlocks));
        },
    }, [id, onChange, editable]);

    return (
        <div className="p-2">
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === 'dark' ? customDarkTheme : 'light'}
            />
        </div>
    );
}
