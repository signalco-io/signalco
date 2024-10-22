import { Stack } from '@signalco/ui-primitives/Stack';
import { TypographyDocumentName } from '../../../../../components/processes/documents/TypographyDocumentName';
import { DocumentEditor } from '../../../../../components/processes/documents/DocumentEditor';

export default async function DocumentEmbeddedPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <Stack spacing={2} className="overflow-x-hidden py-4">
            <div className="px-[62px] pb-8 pt-12">
                <TypographyDocumentName id={id} level="h2" />
            </div>
            <DocumentEditor id={id} />
        </Stack>
    );
}
