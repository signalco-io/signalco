import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from 'classix';

export type StackProps = HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
};

export function Stack({ spacing, alignItems, justifyContent, style, className, ...props }: StackProps) {
    return (
        <div
            className={cx(
                'uitw-flex uitw-flex-col',
                alignItems === 'start' && 'uitw-items-start',
                alignItems === 'center' && 'uitw-items-center',
                (!alignItems || alignItems === 'stretch') && 'uitw-items-stretch',
                Boolean(spacing) && 'uitw-gap-[--s-gap]',
                justifyContent === 'start' && 'uitw-justify-start',
                justifyContent === 'center' && 'uitw-justify-center',
                justifyContent === 'end' && 'uitw-justify-end',
                justifyContent === 'space-between' && 'uitw-justify-between',
                justifyContent === 'stretch' && 'uitw-justify-stretch',
                className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
}
