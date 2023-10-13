import { HTMLAttributes } from 'react';

export type TooltipProps = HTMLAttributes<HTMLDivElement> & {
    title: string | undefined;
};

export function Tooltip({ title, ...rest }: TooltipProps) {
    return <div title={title} {...rest}></div>;
}
