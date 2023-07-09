import { PropsWithChildren } from "react";

export type TooltipProps = PropsWithChildren<{
    title?: string;
}>;

export function Tooltip({ children, title }: TooltipProps) {
    return <div title={title}>{children}</div>;
}
