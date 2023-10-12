'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Typography } from '@signalco/ui/dist/Typography';
import { Row } from '@signalco/ui/dist/Row';
import { Avatar } from '@signalco/ui/dist/Avatar';
import { KnownPages } from '../../src/knownPages';
import { useActiveNavItem } from './useActiveNavItem';
import { SpaceTitle } from './SpaceTitle';
import { EntityTitle } from './EntityTitle';

export function PageTitle({ fullPage = false }: { fullPage?: boolean }) {
    const pathname = usePathname();
    const activeNavItem = useActiveNavItem();

    if (pathname.startsWith(KnownPages.Entities)) {
        const entityId = pathname.split('/')[2];
        if (entityId) {
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <EntityTitle entityId={entityId} />
                </Suspense>
            );
        }
    } else if (pathname.startsWith(KnownPages.Spaces)) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <SpaceTitle />
            </Suspense>
        );
    }

    const Icon = activeNavItem?.icon;

    return (
        <Row spacing={2}>
            {Icon && (
                fullPage ? (
                    <Avatar>
                        <Icon />
                    </Avatar>
                ) : (
                    <Icon />
                )
            )}
            <Typography>{activeNavItem?.label}</Typography>
        </Row>
    );
}
