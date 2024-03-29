'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@signalco/ui-primitives/Spinner';
import { KnownPages } from '../../../../../src/knownPages';

function useLogOut() {
    const router = useRouter();

    return useMutation({
        mutationFn: () => fetch('/api/auth/logout', { method: 'POST' }),
        onSettled: () => {
            router.push(KnownPages.Landing);
        },
    });
}

export default function AppLogoutPage() {
    const logOut = useLogOut();

    useEffect(() => {
        logOut.mutate();
    }, []);

    return (
        <div className="flex h-full items-center justify-center">
            <Spinner loadingLabel={'Logging you out'} loading />
        </div>
    );
}