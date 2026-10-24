import { Children, type HTMLAttributes } from 'react';
import { cx } from '../cx';

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

export function Divider({ orientation = 'horizontal', className, flex, children, ...rest }: DividerProps) {
    const hasContent = Children.toArray(children).some(child => child !== '');

    return (
        <div
            className={cx(
                'shrink-0',
                hasContent
                    ? 'flex items-center gap-2 text-center before:flex-1 before:border-inherit after:flex-1 after:border-inherit'
                    : orientation === 'horizontal' ? 'h-0 border-t w-full' : 'h-full w-0 border-l',
                hasContent && (orientation === 'horizontal'
                    ? 'w-full before:border-t after:border-t [&.text-left]:before:hidden [&.text-right]:after:hidden'
                    : 'h-full w-max max-w-full flex-col before:border-l after:border-l'),
                orientation === 'vertical' && flex && 'self-stretch h-auto',
                className
            )}
            {...rest}
        >
            {hasContent ? <span className="min-w-0">{children}</span> : null}
        </div>
    );
}
