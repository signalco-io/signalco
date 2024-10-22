import React from 'react';
import EntityDetailsView from '../../../components/views/Entity/EntityDetailsView';

export default async function EntityDetailsPage({ params }: { params: Promise<{ id?: string }> }) {
    const { id } = await params;
    return (
        <EntityDetailsView id={id} />
    )
}
