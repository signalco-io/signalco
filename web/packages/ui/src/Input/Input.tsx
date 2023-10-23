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
            {label && <label className="uitw-text-sm uitw-font-medium">{label}</label>}
            <HorizontalContainer>
                {startDecorator ?? null}
                <input
                    className={cx(
                        'uitw-flex uitw-h-10 uitw-w-full uitw-rounded-md uitw-border uitw-border-input uitw-bg-background uitw-px-3 uitw-py-2 uitw-text-sm uitw-ring-offset-background file:uitw-border-0 file:uitw-bg-transparent file:uitw-text-sm file:uitw-font-medium placeholder:uitw-text-muted-foreground focus-visible:uitw-outline-none focus-visible:uitw-ring-2 focus-visible:uitw-ring-ring focus-visible:uitw-ring-offset-2 disabled:uitw-cursor-not-allowed disabled:uitw-opacity-50',
                        className
                    )}
                    {...rest}
                />
                {endDecorator ?? null}
            </HorizontalContainer>
            {helperText && <p className="uitw-text-sm uitw-text-muted-foreground">{helperText}</p>}
        </VerticalContainer>
    );
}
