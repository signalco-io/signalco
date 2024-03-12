'use client';

import { useTheme } from 'next-themes';
import { BlockNoteView, Theme, darkDefaultTheme, useCreateBlockNote } from '@blocknote/react';
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
    const editor = useCreateBlockNote({
        initialContent: JSON.parse(content ?? '[]') as PartialBlock[],
    });

    const handleDocumentChange = () => {
        onChange?.(JSON.stringify(editor.topLevelBlocks));
    };

    return (
        <div className="p-2">
            <BlockNoteView
                id={id}
                contentEditable={editable ?? false}
                onChange={handleDocumentChange}
                editor={editor}
                theme={resolvedTheme === 'dark' ? customDarkTheme : 'light'}
            />
        </div>
    );
}
