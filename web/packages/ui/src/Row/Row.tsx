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
                justifyContent === 'start' && '[justify-content:start]',
                justifyContent === 'center' && '[justify-content:center]',
                justifyContent === 'end' && '[justify-content:end]',
                justifyContent === 'space-between' && '[justify-content:space-between]',
                (!justifyContent || justifyContent === 'stretch') && '[justify-content:stretch]',
                alignItems === 'start' && '[align-items:start]',
                (!alignItems || alignItems === 'center') && '[align-items:center]',
                alignItems === 'end' && '[align-items:end]',
                alignItems === 'stretch' && '[align-items:stretch]',
                justifyItems === 'center' && '[justify-items:center]',
                className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
}
