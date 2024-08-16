'use client';

import { useCallback } from 'react';
import { usePromise } from '@enterwell/react-hooks';
import Roadmap from './roadmap';
import { RoadmapItem } from '../api/github/[owner]/[repo]/issues/route';

export function RoadmapSection() {
    const fetchCallback = useCallback(() => fetch('/api/github/signalco-io/signalco/issues').then(res => res.json()), []);
    const { item, error, isLoading } = usePromise(fetchCallback);

    console.log('Roadmap page render');

    return (
        <Roadmap items={item as RoadmapItem[]} error={error} isLoading={isLoading}  />
    );
}
