import { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../cx';

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg';
} & ({
    children: ReactNode;
    src?: never;
    alt?: never;
} | {
    children?: never;
    src: string;
    alt: string;
});

export function Avatar({ children, size, src, alt, className, ...rest }: AvatarProps) {
    return (
        <div
            className={cx(
                'flex items-center justify-center rounded-full bg-muted border overflow-hidden',
                (!size || size === 'md') && 'h-9 min-w-[36px] max-w-[36px]',
                size === 'sm' && 'h-6 min-w-[24px] max-w-[24px] text-xs',
                size === 'lg' && 'h-12 min-w-[48px] max-w-[48px] text-lg',
                className
            )}
            {...rest}
        >
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={alt}
                    width={size === 'lg' ? 48 : (size === 'sm' ? 24 : 36)}
                    height={size === 'lg' ? 48 : (size === 'sm' ? 24 : 36)} />
            ) : (
                children
            )}
        </div>
    );
}
