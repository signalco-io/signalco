import { HTMLAttributes } from 'react';

export function CommentIcon({ icon, size, variant, ...rest }: HTMLAttributes<SVGElement> & { icon?: 'add' | undefined, size?: number | undefined, variant?: 'outlined' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size ?? 32}
            height={size ?? 32}
            fill="none"
            viewBox="0 0 32 32"
            {...rest}
        >
            <path
                fill={variant === 'outlined' ? undefined : '#000'}
                stroke="#fff"
                strokeWidth={variant === 'outlined' ? 1.75 : 3}
                d="M31 16c0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15V1h15c8.284 0 15 6.716 15 15Z"
            />
            {icon && (
                <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 16h14M16 9v14"
                />
            )}
        </svg>
    );
}
