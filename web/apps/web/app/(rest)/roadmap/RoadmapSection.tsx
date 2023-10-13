'use client';

import { useCallback } from 'react';
import { useLoadAndError } from '@signalco/hooks/dist/useLoadAndError';
import { RoadmapItem } from '../../api/github/[owner]/[repo]/issues/route';
import Roadmap from './roadmap';

export function RoadmapSection() {
    const fetchCallback = useCallback(() => fetch('/api/github/signalco-io/signalco/issues').then(res => res.json()), []);
    const { item, error, isLoading } = useLoadAndError(fetchCallback);

    console.log('Roadmap page render');

    return (
        <Roadmap items={item as RoadmapItem[]} error={error} isLoading={isLoading}  />
    );
}
