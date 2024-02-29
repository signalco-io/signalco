import { redirect } from 'next/navigation';
import { KnownPages } from '../../../../../src/knownPages';

export default function AppSettingsPage() {
    redirect(KnownPages.AppSettingsProfile);
}
