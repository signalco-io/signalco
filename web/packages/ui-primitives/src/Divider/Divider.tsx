import { HTMLAttributes } from 'react';
import { cx } from '../cx'

type DividerProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * The divider orientation.
     * @default horizontal
     */
    orientation?: 'horizontal' | 'vertical';

    /**
     * Set to true to make the divider work inside flex parent element.
     * @default false
     */
    flex?: boolean;
};

export function Divider({ orientation = 'horizontal', className, flex, ...rest }: DividerProps) {
    return (
        <div
            className={cx(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
                orientation === 'vertical' && flex && 'self-stretch h-auto',
                className
            )}
            {...rest} />
    );
}
