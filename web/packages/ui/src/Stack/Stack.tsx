import { cx } from "classix";
import type { CSSProperties, HTMLAttributes } from "react";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
};

export function Stack({ spacing, alignItems, justifyContent, style, className, ...props }: StackProps) {
    return (
        <div
            className={cx(
                `flex flex-col`, 
                alignItems === 'start' && `[align-items:start]`,
                alignItems === 'center' && `[align-items:center]`,
                !alignItems && `[align-items:stretch]`,
                Boolean(spacing) && `gap-[--s-gap]`,
                justifyContent === 'start' && `[justify-content:start]`,
                justifyContent === 'center' && `[justify-content:center]`,
                justifyContent === 'end' && `[justify-content:end]`,
                justifyContent === 'space-between' && `[justify-content:space-between]`,
                justifyContent === 'stretch' && `[justify-content:stretch]`,
                className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
}
