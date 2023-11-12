'use client';

import { useState } from 'react';
import { Stack } from '@signalco/ui/dist/Stack';
import { TypographyDocumentName } from '../../../../../components/processes/documents/TypographyDocumentName';
import { DocumentEditor } from '../../../../../components/processes/documents/DocumentEditor';
import { DocumentDetailsToolbar } from '../../../../../components/processes/documents/DocumentDetailsToolbar';

export default function DocumentPage({ params }: { params: { id: string } }) {
    const {id} = params;
    const [saving, setSaving] = useState(false);
    const editable = true;
    return (
        <Stack spacing={2} className="h-full overflow-x-hidden">
            {editable && <DocumentDetailsToolbar id={id} saving={saving} />}
            <div className="px-[62px]">
                <TypographyDocumentName id={id} level="h2" editable={editable} />
            </div>
            <DocumentEditor
                id={id}
                editable={editable}
                onSavingChange={setSaving} />
        </Stack>
    );
}
