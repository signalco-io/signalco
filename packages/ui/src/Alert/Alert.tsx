import { ChildrenProps } from "../sharedTypes";
import { Alert as JoyAlert } from '@mui/joy';
import { CSSProperties, ReactNode } from "react";

export type AlertProps = ChildrenProps & {
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning",
    variant?: "plain" | "outlined" | "soft" | "solid",
    startDecorator?: ReactNode | undefined,
    endDecorator?: ReactNode | undefined,
    sx?: CSSProperties | undefined
};

export default function Alert({ children, color, variant, startDecorator, endDecorator, sx }: AlertProps) {
    return <JoyAlert color={color} variant={variant} startDecorator={startDecorator} endDecorator={endDecorator} sx={sx}>{children}</JoyAlert>
}
