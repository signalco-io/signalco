import { redirect } from 'next/navigation';
import { KnownPages } from '../../../../../src/knownPages';

export default function MarkerplacePage() {
    redirect(KnownPages.AppMarketplaceCategory('explore'));
}
