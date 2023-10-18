import React from 'react';
import dynamic from 'next/dynamic'

const Dashboards = dynamic(() => import('../../components/dashboards/Dashboards'), { ssr: false });

export default function SpacesPage() {
    return (
        <Dashboards />
    );
}
