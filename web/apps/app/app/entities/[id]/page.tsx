import React from 'react';
import EntityDetailsView from '../../../components/views/Entity/EntityDetailsView';

export default function EntityDetailsPage({ params }: { params: { id?: string } }) {
    return (
        <EntityDetailsView id={params.id} />
    )
}
