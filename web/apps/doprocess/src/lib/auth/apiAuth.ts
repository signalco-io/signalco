import { auth } from '@clerk/nextjs';

export function ensureUserId() {
    const { userId } = auth();
    if (userId == null)
        throw new Error('Not authenticated');
    return { userId };
}
