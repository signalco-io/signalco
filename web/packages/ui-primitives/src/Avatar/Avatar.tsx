import { HTMLAttributes } from 'react';
import { cx } from '../cx';

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg';
} & ({
    children: React.ReactNode;
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
                'flex items-center justify-center rounded-full bg-muted border',
                (!size || size === 'md') && 'h-10 min-w-[40px] max-w-[40px]',
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
                    width={size === 'lg' ? 48 : (size === 'sm' ? 24 : 40)}
                    height={size === 'lg' ? 48 : (size === 'sm' ? 24 : 40)} />
            ) : (
                children
            )}
        </div>
    );
}
