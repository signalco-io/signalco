import { InputHTMLAttributes, PropsWithChildren, useMemo } from 'react';
import { Stack } from '../Stack';
import { Row } from '../Row';
import { cx } from '../cx';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    startDecorator?: React.ReactNode;
    endDecorator?: React.ReactNode;
    label?: string;
    helperText?: string;
    fullWidth?: boolean;
    variant?: 'outlined' | 'plain';
};

export function Input({
    label,
    helperText,
    className,
    startDecorator,
    endDecorator,
    variant,
    ...rest
}: InputProps) {
    const VerticalContainer = useMemo(() => label || helperText
        ? (props: PropsWithChildren) => <Stack spacing={1} {...props} />
        : (props: PropsWithChildren) => <>{props.children}</>
    , [label, helperText]);
    const HorizontalContainer = useMemo(() => startDecorator || endDecorator
        ? (props: PropsWithChildren) => <Row spacing={1} {...props} />
        : (props: PropsWithChildren) => <>{props.children}</>
    , [startDecorator, endDecorator]);

    return (
        <VerticalContainer>
            {label && <label className="text-sm font-medium">{label}</label>}
            <HorizontalContainer>
                {startDecorator ?? null}
                <input
                    className={cx(
                        'flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed',
                        (!variant || variant === 'outlined') && 'border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
                        variant === 'plain' && 'border-0 bg-transparent disabled:opacity-50 disabled:bg-muted/30',
                        className
                    )}
                    {...rest}
                />
                {endDecorator ?? null}
            </HorizontalContainer>
            {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
        </VerticalContainer>
    );
}
