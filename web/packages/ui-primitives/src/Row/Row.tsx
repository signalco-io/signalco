import { type HTMLAttributes, type CSSProperties, forwardRef } from 'react';
import { cx } from '../cx';

export type RowProps = HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | 'end' | undefined;
    justifyContent?: CSSProperties['justifyContent'];
    justifyItems?: 'center' | undefined;
    style?: CSSProperties | undefined;
};

const Row = forwardRef<HTMLDivElement, RowProps>(({ spacing, alignItems, justifyContent, justifyItems, style, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
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
                '--s-gap': `${(spacing ?? 0) * 0.5}rem`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
});
Row.displayName = 'Row';
export { Row };
