import React, { forwardRef } from 'react';
import type { SupportedColorScheme } from '@signalco/ui/theme';

interface DoProcessLogoProps {
    width?: number;
    height?: number;
    theme?: SupportedColorScheme;
}

function DoProcessLogo({ width, height, theme }: DoProcessLogoProps, ref: React.Ref<HTMLDivElement>) {
    if (typeof width === 'undefined' &&
        typeof height === 'undefined') {
        throw new Error('Either height or width must be provided to SignalcoLogo.');
    }
    const paddingTop = height ? Math.ceil(height / 10.5) : Math.ceil((width ?? 0) / 40);
    const fixedHeight = height ?? (30 / 33) * ((width ?? 0) + paddingTop * 4);
    const fixedWidth = width ?? (33 / 30) * ((height ?? 0) - paddingTop);
    const fill = !theme ? 'hsl(var(--foreground))' : (theme === 'dark' ? '#ffffff' : '#000000');

    return (
        <div aria-label="doprocess" role="img" ref={ref}>
            <svg version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width={fixedWidth}
                height={fixedHeight - paddingTop}
                viewBox="0 0 33 30"
                preserveAspectRatio="xMidYMid meet">
                <path d="M15.048 24.16C13.4267 24.16 11.9653 23.7973 10.664 23.072C9.36265 22.3253 8.33865 21.3013 7.59198 20C6.84532 18.6986 6.47198 17.2266 6.47198 15.584C6.47198 13.9413 6.84532 12.4693 7.59198 11.168C8.33865 9.86665 9.36265 8.85331 10.664 8.12798C11.9653 7.40264 13.4267 7.03998 15.048 7.03998C16.6693 7.03998 18.1307 7.40264 19.432 8.12798C20.7333 8.85331 21.7467 9.86665 22.472 11.168C23.2187 12.4693 23.592 13.9413 23.592 15.584C23.592 17.2266 23.2187 18.6986 22.472 20C21.7467 21.3013 20.7333 22.3253 19.432 23.072C18.1307 23.7973 16.6693 24.16 15.048 24.16ZM15.048 22.144C16.2427 22.144 17.3093 21.8773 18.248 21.344C19.208 20.7893 19.9547 20.0106 20.488 19.008C21.0213 18.0053 21.288 16.864 21.288 15.584C21.288 14.304 21.0213 13.1626 20.488 12.16C19.9547 11.1573 19.208 10.3893 18.248 9.85598C17.3093 9.30131 16.2427 9.02398 15.048 9.02398C13.8533 9.02398 12.776 9.30131 11.816 9.85598C10.8773 10.3893 10.1307 11.1573 9.57598 12.16C9.04265 13.1626 8.77599 14.304 8.77599 15.584C8.77599 16.864 9.04265 18.0053 9.57598 19.008C10.1307 20.0106 10.8773 20.7893 11.816 21.344C12.776 21.8773 13.8533 22.144 15.048 22.144Z" style={{ fill }} />
                <g clipPath="url(#clip0_1106_310)" style={{ fill }}>
                    <path d="M15.325 18.1913L10.6338 13.5L9.03625 15.0863L15.325 21.375L28.825 7.87501L27.2388 6.28876L15.325 18.1913Z" style={{ fill }}/>
                </g>
                <defs>
                    <clipPath id="clip0_1106_310">
                        <rect width="27" height="27" fill="white" transform="translate(5.20001)"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
    )
}

export default forwardRef<HTMLDivElement, DoProcessLogoProps>(DoProcessLogo);
