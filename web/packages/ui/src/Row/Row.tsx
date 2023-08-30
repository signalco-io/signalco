import type { HTMLAttributes, CSSProperties } from 'react';
import { cx } from 'classix';

export type RowProps = HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | 'end' | undefined;
    justifyContent?: CSSProperties['justifyContent'];
    justifyItems?: 'center' | undefined;
    style?: CSSProperties | undefined;
};

export function Row({ spacing, alignItems, justifyContent, justifyItems, style, className, ...props }: RowProps) {
    return (
        <div
            className={cx(
                'flex gap-[--s-gap]',
                justifyContent === 'start' && 'justify-start',
                justifyContent === 'center' && 'justify-center',
                justifyContent === 'end' && 'justify-end',
                justifyContent === 'space-between' && 'justify-between',
                (!justifyContent || justifyContent === 'stretch') && 'justify-stretch',
                alignItems === 'start' && 'items-start',
                (!alignItems || alignItems === 'center') && 'items-center',
                alignItems === 'end' && 'items-end',
                alignItems === 'stretch' && 'items-stretch',
                justifyItems === 'center' && 'justify-items-center',
                className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
}
