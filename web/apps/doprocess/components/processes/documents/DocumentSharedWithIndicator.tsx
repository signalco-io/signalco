import { Loadable } from '@signalco/ui/Loadable';
import { SharedWithIndicator } from '../../shared/SharedWithIndicator';
import { useDocument } from '../../../src/hooks/useDocument';

export function DocumentSharedWithIndicator({ documentId }: { documentId: string; }) {
    const {data: document, isLoading: documentIsLoading, error: documentError} = useDocument(documentId);
    return (
        <Loadable
            placeholder="skeletonRect"
            error={documentError}
            isLoading={documentIsLoading}
            width={80}
            height={20}
            loadingLabel={'Loading share information...'}>
            {document && <SharedWithIndicator shareableEntity={document}/>}
        </Loadable>
    );
}
