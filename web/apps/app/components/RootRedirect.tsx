'use client';

import { useRouter } from 'next/navigation';
import { KnownPages } from '../src/knownPages';

export function RootRedirect() {
    const router = useRouter();
    // TODO: Determine what is home page based on user's preferences
    router.push(KnownPages.Spaces);

    console.debug('Redirecting to root page...');

    return <div></div>;
}
