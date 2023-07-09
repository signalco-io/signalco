import { cx } from 'classix';
import { type HTMLAttributes, type ReactNode } from "react";

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
    color?: "primary" | "neutral" | "danger" | "info" | "success" | "warning",
    startDecorator?: ReactNode | undefined,
    endDecorator?: ReactNode | undefined,
};

export function Alert({ color, startDecorator, endDecorator, className, ...props }: AlertProps) {
    return (
        <div
            role="alert"
            // color={color}
            // startDecorator={startDecorator}
            // endDecorator={endDecorator}
            className={cx("", className)}
            {...props} />
    );
}
