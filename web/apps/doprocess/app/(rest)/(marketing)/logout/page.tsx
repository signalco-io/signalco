import { redirect } from 'next/navigation'
import { clearCookie } from '../../../../src/lib/auth/auth';
import { KnownPages } from '../../../../src/knownPages'

async function logout() {
    'use server';

    clearCookie();
}

export default async function LogoutPage() {
    await logout();
    redirect(KnownPages.Landing);
}