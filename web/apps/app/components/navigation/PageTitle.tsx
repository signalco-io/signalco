'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { KnownPages } from '../../src/knownPages';
import { useActiveNavItem } from './useActiveNavItem';
import { SpaceTitle } from './SpaceTitle';
import { EntityTitle } from './EntityTitle';
import { EntitiesTitle } from './EntitiesTitle';

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
        } else {
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <EntitiesTitle />
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
            <Typography level={fullPage ? 'h4' : 'h6'}>{activeNavItem?.label}</Typography>
        </Row>
    );
}
