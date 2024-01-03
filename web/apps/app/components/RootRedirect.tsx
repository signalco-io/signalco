import { redirect } from 'next/navigation';
import { KnownPages } from '../src/knownPages';

export function RootRedirect() {
    redirect(KnownPages.Spaces);
}
