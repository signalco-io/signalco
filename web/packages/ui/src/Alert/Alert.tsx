import { Alert as JoyAlert } from '@mui/joy';
import { CSSProperties, ReactNode } from "react";

export type AlertProps = {
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning",
    variant?: "plain" | "outlined" | "soft" | "solid",
    startDecorator?: ReactNode | undefined,
    endDecorator?: ReactNode | undefined,
    sx?: CSSProperties | undefined,
    children?: React.ReactNode | string | undefined,
    className?: string | undefined
};

export function Alert({ children, color, variant, startDecorator, endDecorator, sx, className }: AlertProps) {
    return <JoyAlert color={color} variant={variant} startDecorator={startDecorator} endDecorator={endDecorator} sx={sx} className={className}>{children}</JoyAlert>
}
