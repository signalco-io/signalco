'use client';

import React, { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { cx } from '@signalco/ui-primitives/cx';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { PageTitle } from '../navigation/titles/PageTitle';

export function PageContent({ children }: PropsWithChildren) {
    const [isFullScreen] = useSearchParam('fullscreen');

    return (
        <div className={cx(
            'relative w-full grow overflow-hidden',
            isFullScreen ? '' : 'mt-[60px] sm:ml-[66px] sm:mt-0'
        )}>
            <Stack>
                <div className="hidden p-2 sm:block">
                    <PageTitle fullPage />
                </div>
                {children}
            </Stack>
        </div>
    );
}
