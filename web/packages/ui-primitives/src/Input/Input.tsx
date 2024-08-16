import { InputHTMLAttributes, PropsWithChildren, ReactNode, useMemo } from 'react';
import { Stack } from '../Stack';
import { Row } from '../Row';
import { cx } from '../cx';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
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
    fullWidth,
    variant,
    ...rest
}: InputProps) {
    const VerticalContainer = useMemo(() => label || helperText
        ? (props: PropsWithChildren) => <Stack spacing={1} {...props} />
        : (props: PropsWithChildren) => <>{props.children}</>
    , [label, helperText]);
    const HorizontalContainer = useMemo(() => startDecorator || endDecorator
        ? ({ className, ...propsRest }: PropsWithChildren & { className: string }) => <Row className={cx('pr-[1px]', className)} {...propsRest} />
        : ({ ...propsRest }: PropsWithChildren & { className: string }) => <div {...propsRest} />
    , [startDecorator, endDecorator]);

    return (
        <VerticalContainer>
            {label && <label className="text-sm font-medium">{label}</label>}
            <HorizontalContainer className={cx(
                fullWidth && 'w-full',
                'rounded-md ring-offset-background',
                'has-[:focus-visible]:outline-none has-[:focus-visible]:ring-offset-2',
                'has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed',
                'has-[:file]:border-0 has-[:file]:bg-transparent has-[:file]:text-sm has-[:file]:font-medium',
                'has-[:placeholder]:text-muted-foreground',
                (!variant || variant === 'outlined') && 'border border-input bg-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                variant === 'plain' && 'border-0 bg-transparent has-[:disabled]:bg-muted/30',
                className
            )}>
                {startDecorator ?? null}
                <input
                    className={cx(
                        'bg-transparent w-full',
                        'ring-0 outline-none',
                        'flex h-10 px-3 py-2 text-sm grow'
                    )}
                    {...rest}
                />
                {endDecorator ?? null}
            </HorizontalContainer>
            {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
        </VerticalContainer>
    );
}
