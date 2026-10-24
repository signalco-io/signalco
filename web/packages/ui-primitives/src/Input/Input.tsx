import { InputHTMLAttributes, PropsWithChildren, ReactNode, useId } from 'react';
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

function VerticalContainer({ enabled, children }: PropsWithChildren<{ enabled: boolean }>) {
    return enabled ? <Stack spacing={0.5}>{children}</Stack> : <>{children}</>;
}

function HorizontalContainer({ enabled, className, ...props }: PropsWithChildren<{ enabled: boolean; className: string }>) {
    return enabled
        ? <Row className={cx('pr-[1px]', className)} {...props} />
        : <div className={className} {...props} />;
}

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

    return (
        <VerticalContainer enabled={Boolean(label || helperText)}>
            {label && <label className="text-sm font-medium" id={labelId}>{label}</label>}
            <HorizontalContainer enabled={Boolean(startDecorator || endDecorator)} className={cx(
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
                    id={id ?? name ?? customId}
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
