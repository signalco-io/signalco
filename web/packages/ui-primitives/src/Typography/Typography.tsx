import { ForwardedRef, createElement, forwardRef, type HTMLAttributes } from 'react';
import type { ColorVariants } from '../theme';
import { cx } from '../cx';

export type TypographyProps = HTMLAttributes<HTMLParagraphElement> & {
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'body3';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    semiBold?: boolean;
    bold?: boolean;
    extraThin?: boolean;
    thin?: boolean;
    uppercase?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    noWrap?: boolean;
    color?: ColorVariants;
    gutterBottom?: boolean;
    center?: boolean;
    mono?: boolean;
};

export function populateTypographyStylesAndClasses({
    color,
    level,
    center, gutterBottom, noWrap, uppercase,
    secondary, tertiary,
    mono,
    extraThin, thin, semiBold, bold,
    className,
    ...rest
}: Omit<TypographyProps, 'component' | 'children'>) {
    return {
        className: cx(
            'm-0',
            // Levels
            level === 'body1' && 'text-base text-primary',
            level === 'body2' && 'text-sm text-secondary-foreground',
            level === 'body3' && 'text-xs text-tertiary-foreground',
            level === 'h1' && 'text-5xl text-balance',
            level === 'h2' && 'text-4xl text-balance',
            level === 'h3' && 'text-3xl text-balance',
            level === 'h4' && 'text-2xl text-balance',
            level === 'h5' && 'text-xl text-balance',
            level === 'h6' && 'text-lg text-balance',
            // Color
            color === 'success' && 'text-green-500',
            color === 'warning' && 'text-yellow-500',
            color === 'danger' && 'text-red-500',
            color === 'info' && 'text-blue-500',
            color === 'neutral' && 'text-slate-500',
            // Font weight
            extraThin && 'font-thin',
            thin && 'font-light',
            semiBold && 'font-medium',
            bold && 'font-bold',
            // Alignment
            center && 'text-center',
            // Font
            mono && 'font-mono',
            // Special cases
            noWrap && 'whitespace-nowrap overflow-hidden overflow-ellipsis',
            gutterBottom && 'mb-2',
            uppercase && 'uppercase',
            secondary && 'text-secondary-foreground',
            tertiary && 'text-tertiary-foreground',
            className
        ),
        ...rest
    }
}

export const Typography = forwardRef<HTMLDivElement, TypographyProps>(function Typography(props: TypographyProps, ref?: ForwardedRef<HTMLDivElement>) {
    const { level, component, children, ...rest } = props;

    return createElement(
        component ?? (level?.startsWith('h') ? level : 'p'),
        {
            ref: ref,
            ...populateTypographyStylesAndClasses({ level, ...rest })
        },
        children);
});
