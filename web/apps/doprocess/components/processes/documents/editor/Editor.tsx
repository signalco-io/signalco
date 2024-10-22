'use client';

import { useTheme } from 'next-themes';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView, darkDefaultTheme, type Theme } from '@blocknote/mantine';
import { type PartialBlock } from '@blocknote/core';

import '@blocknote/mantine/style.css';

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
        onChange?.(JSON.stringify(editor.document));
    };

    return (
        <div className="p-2">
            <BlockNoteView
                // @ts-expect-error TODO: Remove when types are updated
                id={id}
                contentEditable={editable ?? false}
                onChange={handleDocumentChange}
                editor={editor}
                theme={resolvedTheme === 'dark' ? customDarkTheme : 'light'}
            />
        </div>
    );
}
