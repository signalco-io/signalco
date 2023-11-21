import { InputHTMLAttributes, PropsWithChildren, useMemo } from 'react';
import { cx } from 'classix';
import { Stack } from '../Stack';
import { Row } from '../Row';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    startDecorator?: React.ReactNode;
    endDecorator?: React.ReactNode;
    label?: string;
    helperText?: string;
};

export function Input({
    label,
    helperText,
    className,
    startDecorator,
    endDecorator,
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
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
