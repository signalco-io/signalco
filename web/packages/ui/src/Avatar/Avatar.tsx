import { PropsWithChildren } from 'react';

export type AvatarProps = PropsWithChildren<{
    size?: 'sm' | 'md' | 'lg'; // TODO: Implement
    src?: string; // TODO: Implement
    alt?: string; // TODO: Implement
}>;

export function Avatar({ children }: AvatarProps) {
    return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">{children}</div>;
}
