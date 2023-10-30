import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';

export function Editor() {
    const editor = useBlockNote({
        editable: true
    });

    return (
        <div className="p-2">
            <BlockNoteView editor={editor} theme="light" />
        </div>
    );
}
