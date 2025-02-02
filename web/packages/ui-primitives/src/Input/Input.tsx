import { InputHTMLAttributes, PropsWithChildren, ReactNode, useId, useMemo } from 'react';
import { Stack } from '../Stack';
import { Row } from '../Row';
import { cx } from '../cx';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
    label?: string;
    helperText?: string;
    fullWidth?: boolean;
    /**
     * The variant to use.
     * @default 'outlined'
     **/
    variant?: 'soft' | 'outlined' | 'plain';
};

export function Input({
    id,
    name,
    label,
    helperText,
    className,
    startDecorator,
    endDecorator,
    fullWidth,
    variant,
    ...rest
}: InputProps) {
    const customId = useId();
    const labelId = label ? `label-${id ?? name ?? customId}` : undefined;
    const VerticalContainer = useMemo(() => label || helperText
        ? (props: PropsWithChildren) => <Stack spacing={0.5} {...props} />
        : (props: PropsWithChildren) => <>{props.children}</>
    , [label, helperText]);
    const HorizontalContainer = useMemo(() => startDecorator || endDecorator
        ? ({ className, ...propsRest }: PropsWithChildren & { className: string }) => <Row className={cx('pr-[1px]', className)} {...propsRest} />
        : ({ ...propsRest }: PropsWithChildren & { className: string }) => <div {...propsRest} />
    , [startDecorator, endDecorator]);

    return (
        <VerticalContainer>
            {label && <label className="text-sm font-medium" id={labelId}>{label}</label>}
            <HorizontalContainer className={cx(
                fullWidth && 'w-full',
                'rounded-md ring-offset-background',
                'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                (!variant || variant === 'outlined') && 'border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring',
                variant === 'plain' && 'border-0 bg-transparent disabled:bg-muted/30',
                variant === 'soft' && 'border focus-visible:ring-2 focus-visible:ring-ring border-muted-foreground/10 bg-primary/10',
                className
            )}>
                {startDecorator ?? null}
                <input
                    id={id}
                    name={name}
                    aria-labelledby={labelId}
                    className={cx(
                        'bg-transparent w-full',
                        'ring-0 outline-none',
                        'flex h-10 px-3 py-2 text-sm grow'
                    )}
                    {...rest}
                />
                {endDecorator ?? null}
            </HorizontalContainer>
            {helperText && <span className="text-sm text-red-600 dark:text-red-300">{helperText}</span>}
        </VerticalContainer>
    );
}
