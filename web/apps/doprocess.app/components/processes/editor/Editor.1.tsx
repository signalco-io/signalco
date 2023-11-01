import { BlockNoteView, useBlockNote } from '@blocknote/react';


export function Editor({ editable }: { editable?: boolean; }) {
    const editor = useBlockNote({
        editable
    });

    return (
        <div className="p-2">
            <BlockNoteView editor={editor} theme="light" />
        </div>
    );
}
