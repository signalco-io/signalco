'use client';

import { ComponentPropsWithoutRef } from 'react';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';
import { UserButton as ClerkUserButton } from '@clerk/nextjs';

export function UserButton(props: ComponentPropsWithoutRef<typeof ClerkUserButton>) {
    const { resolvedTheme } = useTheme();

    return (
        <ClerkUserButton
            appearance={{
                baseTheme: resolvedTheme === 'dark' ? dark : undefined,
            }}
            userProfileProps={{
                appearance: {
                    baseTheme: resolvedTheme === 'dark' ? dark : undefined,
                },
            }}
            {...props} />
    );
}
