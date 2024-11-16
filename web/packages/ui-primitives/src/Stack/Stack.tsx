import { forwardRef, type CSSProperties, type HTMLAttributes, PropsWithChildren } from 'react';
import { cx } from '../cx';

export type StackProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
}>;

const Stack = forwardRef<HTMLDivElement, StackProps>(({ spacing, alignItems, justifyContent, style, className, ...props }: StackProps, ref) => {
    return (
        <div
            ref={ref}
            className={cx(
                'flex flex-col',
                alignItems === 'start' && 'items-start',
                alignItems === 'center' && 'items-center',
                (!alignItems || alignItems === 'stretch') && 'items-stretch',
                Boolean(spacing) && 'gap-[--s-gap]',
                justifyContent === 'start' && 'justify-start',
                justifyContent === 'center' && 'justify-center',
                justifyContent === 'end' && 'justify-end',
                justifyContent === 'space-between' && 'justify-between',
                justifyContent === 'stretch' && 'justify-stretch',
                className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 0.5}rem`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
});
Stack.displayName = 'Stack';
export { Stack };
