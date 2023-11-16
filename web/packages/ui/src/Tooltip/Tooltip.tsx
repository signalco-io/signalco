import { HTMLAttributes, forwardRef } from 'react';

export type TooltipProps = HTMLAttributes<HTMLDivElement> & {
    title: string | undefined;
};

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({ title, ...rest }, ref) => {
    return <div title={title} ref={ref} {...rest}></div>;
});
Tooltip.displayName = 'Tooltip';
export { Tooltip };
