'use client';

import { useRouter } from 'next/navigation';
import { KnownPages } from '../src/knownPages';

export default function Dashboard() {
    // Redirect to spaces page
    const router = useRouter();
    router.push(KnownPages.Spaces);

    console.debug('Redirecting to spaces page')

    return null;
}
