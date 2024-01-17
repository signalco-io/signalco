import React, { PropsWithChildren } from 'react';
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
                    <PageContent>
                        {children}
                    </PageContent>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
                <FullScreenExitButton />
            </AppClientWrapper>
        </AuthWrapper>
    );
}
