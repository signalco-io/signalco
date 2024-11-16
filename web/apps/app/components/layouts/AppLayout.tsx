'use client';

import React, { PropsWithChildren, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PageContent } from './PageContent';
import { FullScreenExitButton } from './FullScreenExitButton';
import { AuthWrapper } from './AuthWrapper';
import { AppClientWrapper } from './AppClientWrapper';

const NavProfile = dynamic(() => import('../navigation/NavProfile'), { ssr: false });

export function AppLayout({ children }: PropsWithChildren) {
    return (
        <AuthWrapper>
            <AppClientWrapper>
                <div className="flex w-full flex-col sm:flex-row">
                    <NavProfile />
                    <Suspense>
                        <PageContent>
                            {children}
                        </PageContent>
                    </Suspense>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
                <Suspense>
                    <FullScreenExitButton />
                </Suspense>
            </AppClientWrapper>
        </AuthWrapper>
    );
}
