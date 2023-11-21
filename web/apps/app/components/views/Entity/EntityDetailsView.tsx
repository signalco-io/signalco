'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { NoDataPlaceholder } from '@signalco/ui/NoDataPlaceholder';
import { Loadable } from '@signalco/ui/Loadable';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import ContactsTable from './ContactsTable';

const EntityProcessDetailsDynamic = dynamic(() => import('./EntityProcessDetails'), { ssr: false, loading: () => <div>Loading...</div> });
const EntityStationDetailsDynamic = dynamic(() => import('./EntityStationDetails'), { ssr: false, loading: () => <div>Loading...</div> });

type EntityDetailsViewProps = {
    id?: string;
}

export default function EntityDetailsView({ id }: EntityDetailsViewProps) {
    const { isLoading, error, data: entity } = useEntity(id);
    const [showRawParam] = useSearchParam<string>('raw', 'false');
    const showRaw = showRawParam === 'true';

    const detailsComponent = useMemo(() => {
        switch (entity?.type) {
        case 3:
            return <EntityProcessDetailsDynamic entity={entity} />
        case 4:
            return <EntityStationDetailsDynamic entity={entity} />
        default:
            return null;
        }
    }, [entity]);
    const showRawResolved = detailsComponent == null || showRaw;

    if (!isLoading && !error && entity == null) {
        return (
            <NoDataPlaceholder>
                Not Found
            </NoDataPlaceholder>
        );
    }
    return (
        <Loadable isLoading={isLoading} loadingLabel="Loading entity" error={error}>
            {showRawResolved ? (
                <ContactsTable entity={entity} />
            ) : (
                <>
                    {detailsComponent}
                </>
            )}
        </Loadable>
    );
}
