import React, { } from 'react';
import { useRouter } from 'next/router'
import { NoDataPlaceholder } from '@signalco/ui';
import EntityDetailsView from '../../components/views/Entity/EntityDetailsView';
import { AppLayoutWithAuth } from '../../components/layouts/AppLayoutWithAuth';

function EntityDetailsPage() {
    const router = useRouter();
    const { id: queryId } = router.query;
    const id = typeof queryId !== 'object' && typeof queryId !== 'undefined' ? queryId : undefined;

    if (!id) {
        return <NoDataPlaceholder content={'Not found'} />;
    }

    return (
        <EntityDetailsView id={id} />
    )
}

EntityDetailsPage.layout = AppLayoutWithAuth;

export default EntityDetailsPage;
