import { type HTMLAttributes, type CSSProperties, forwardRef } from 'react';
import { cx } from 'classix';

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
                'uitw-flex uitw-gap-[--s-gap]',
                justifyContent === 'start' && 'uitw-justify-start',
                justifyContent === 'center' && 'uitw-justify-center',
                justifyContent === 'end' && 'uitw-justify-end',
                justifyContent === 'space-between' && 'uitw-justify-between',
                (!justifyContent || justifyContent === 'stretch') && 'uitw-justify-stretch',
                alignItems === 'start' && 'uitw-items-start',
                (!alignItems || alignItems === 'center') && 'uitw-items-center',
                alignItems === 'end' && 'uitw-items-end',
                alignItems === 'stretch' && 'uitw-items-stretch',
                justifyItems === 'center' && 'uitw-justify-items-center',
                className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
});
Row.displayName = 'Row';
export { Row };
