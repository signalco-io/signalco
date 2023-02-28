'use client';

import React, { } from 'react';
import { NoDataPlaceholder } from '@signalco/ui';
import EntityDetailsView from '../../../components/views/Entity/EntityDetailsView';

export default function EntityDetailsPage({ params }: { params: { id: string } }) {
    if (!params.id) {
        return <NoDataPlaceholder content={'Not found'} />;
    }

    return (
        <EntityDetailsView id={params.id} />
    )
}
