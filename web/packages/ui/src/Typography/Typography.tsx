import React, { CSSProperties } from "react";
import { ChildrenProps, ColorVariants } from "../sharedTypes";

export type TypographyProps = ChildrenProps & {
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
    lineHeight?: number;
    noWrap?: boolean;
    opacity?: number;
    color?: ColorVariants;
};

export default function Typography({ children, component, level, opacity, textAlign, lineHeight, fontSize, textDecoration, textTransform, extraThin, thin, semiBold, bold, italic, strikeThrough, secondary, color, noWrap }: TypographyProps) {
    const styles: CSSProperties = {
        fontFamily: 'var(--joy-fontFamily-body)',
        fontSize: level?.startsWith('h') 
            ? `var(--joy-fontSize-xl${7 - (parseInt(level.substring(1)) || 0)})` 
            : `var(--joy-fontSize-${level === 'body2' ? 'sm' : (level === 'body3' ? 'xs' : 'md')})`,
    };
    if (extraThin) styles['fontWeight'] = 100;
    if (thin) styles['fontWeight'] = 300;
    if (semiBold) styles['fontWeight'] = 500;
    if (bold) styles['fontWeight'] = 700;
    if (italic) styles['fontStyle'] = 'italic';
    if (textAlign) styles['textAlign'] = textAlign;
    if (textTransform) styles['textTransform'] = textTransform;
    if (strikeThrough) styles['textDecoration'] = 'line-through';
    if (textDecoration) styles['textDecoration'] = textDecoration;
    if (fontSize) styles['fontSize'] = `${fontSize}px`;
    if (lineHeight) styles['lineHeight'] = lineHeight;
    if (secondary) styles['color'] = 'var(--joy-palette-text-secondary)';
    if (opacity) styles['opacity'] = opacity;
    if (noWrap) {
        styles['whiteSpace'] = 'nowrap';
        styles['overflow'] = 'hidden';
        styles['textOverflow'] = 'ellipsis';
    }
    if (color) styles['color'] = `var(--joy-palette-${color}-plainColor)`;

    return React.createElement(component ?? (level?.startsWith('h') ? level : 'p'), { children, style: styles });
}
