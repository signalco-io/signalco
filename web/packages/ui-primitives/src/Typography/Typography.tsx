import { type CSSProperties, ForwardedRef, createElement, forwardRef, type HTMLAttributes } from 'react';
import type { ColorVariants } from '../theme';
import { cx } from '../cx';

export type TypographyProps = HTMLAttributes<HTMLParagraphElement> & {
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'body3';
    component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    semiBold?: boolean;
    bold?: boolean;
    extraThin?: boolean;
    thin?: boolean;
    italic?: boolean;
    strikeThrough?: boolean;
    textDecoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: number | string;
    secondary?: boolean;
    tertiary?: boolean;
    lineHeight?: number;
    noWrap?: boolean;
    opacity?: number;
    color?: ColorVariants;
    gutterBottom?: boolean;
};

function populateTypographyStyles(styles: CSSProperties, { gutterBottom, opacity, textAlign, lineHeight, fontSize, textDecoration, textTransform, extraThin, thin, semiBold, bold, italic, strikeThrough, secondary, tertiary, noWrap, ...rest }: TypographyProps) {
    if (extraThin) styles['fontWeight'] = 100;
    if (thin) styles['fontWeight'] = 300;
    if (semiBold) styles['fontWeight'] = 500;
    if (bold) styles['fontWeight'] = 700;
    if (italic) styles['fontStyle'] = 'italic';
    if (textAlign) styles['textAlign'] = textAlign;
    if (textTransform) styles['textTransform'] = textTransform;
    if (strikeThrough) styles['textDecoration'] = 'line-through';
    if (textDecoration) styles['textDecoration'] = textDecoration;
    if (fontSize) styles['fontSize'] = typeof fontSize === 'string' ? fontSize : `${fontSize}px`;
    if (lineHeight) styles['lineHeight'] = lineHeight;
    if (secondary) styles['color'] = 'hsl(var(--muted-foreground))';
    if (tertiary) styles['color'] = 'hsl(var(--muted-foreground))';
    if (opacity) styles['opacity'] = opacity;
    if (gutterBottom) styles['marginBottom'] = '0.5rem';
    if (noWrap) {
        styles['whiteSpace'] = 'nowrap';
        styles['overflow'] = 'hidden';
        styles['textOverflow'] = 'ellipsis';
    }
    return rest;
}

export function populateTypographyStylesAndClasses({ color, level, className, ...rest }: Omit<TypographyProps, 'component' | 'children'>) {
    const styles: CSSProperties = {};
    const restAfterCustomStyles = populateTypographyStyles(styles, rest);

    return {
        style: styles,
        className: cx(
            'm-0',
            level === 'body2' && 'text-sm text-secondary-foreground',
            level === 'body3' && 'text-xs',
            level === 'h1' && 'text-5xl',
            level === 'h2' && 'text-4xl',
            level === 'h3' && 'text-3xl',
            level === 'h4' && 'text-2xl',
            level === 'h5' && 'text-xl',
            level === 'h6' && 'text-lg',
            color === 'success' && 'text-green-500',
            color === 'warning' && 'text-yellow-500',
            color === 'danger' && 'text-red-500',
            color === 'info' && 'text-blue-500',
            color === 'neutral' && 'text-slate-500',
            className
        ),
        ...restAfterCustomStyles
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
