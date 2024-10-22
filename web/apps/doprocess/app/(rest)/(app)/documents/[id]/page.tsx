'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { useDocument } from '../../../../../src/hooks/useDocument';
import { TypographyDocumentName } from '../../../../../components/processes/documents/TypographyDocumentName';
import { DocumentEditor } from '../../../../../components/processes/documents/DocumentEditor';
import { DocumentDetailsToolbar } from '../../../../../components/processes/documents/DocumentDetailsToolbar';

export default function DocumentPage() {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const [saving, setSaving] = useState(false);
    const { data: document } = useDocument(id);
    const editable = document != null;

    return (
        <Stack spacing={2} className="h-full overflow-x-hidden">
            {editable && <DocumentDetailsToolbar id={id} saving={saving} />}
            <div className={cx('px-[62px]', !editable && 'pt-16')}>
                <TypographyDocumentName
                    id={id}
                    level="h2"
                    editable={editable}
                    placeholderHeight={40}
                    placeholderWidth={230} />
            </div>
            <DocumentEditor
                id={id}
                editable={editable}
                onSavingChange={setSaving} />
        </Stack>
    );
}
