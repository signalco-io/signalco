import { auth } from '@clerk/nextjs';

export function optionalUserId() {
    const { userId } = auth();
    return { userId };
}

export function ensureUserId() {
    const { userId } = optionalUserId();
    if (userId == null)
        throw new Error('Not authenticated');
    return { userId };
}
