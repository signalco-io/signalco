import { CSSProperties } from 'react';
import { cx } from '@signalco/ui-primitives/cx';

function TvVisual({ state, size }: { state: boolean, size?: number }) {
    const isActive = state;
    const screenColor = isActive ? '#378DBD' : '#333';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cx(
                'mt-2 [&_*]:transition-all',
                Boolean(size) ? 'w-[--visual-size] h-[--visual-size]' : 'w-full h-full'
            )}
            style={{
                '--visual-size': size ? `${size}px` : undefined
            } as CSSProperties}
            fill="none"
            viewBox="0 0 103 77">
            <g>
                <path fill="hsl(var(--foreground))" d="M19 14h65v40.524H19z" />
                <path fill="hsl(var(--foreground))" d="M39.172 54.524h24.655v3.286H39.172z" />
                <path fill="hsl(var(--foreground))" d="M32.448 57.809h38.103v2.19H32.448z" />
                <g filter={isActive ? 'url(#tvvisualfilter0_d)' : ''}>
                    <path fill={screenColor} d="M22.362 18.381h58.276v31.762H22.362z" />
                </g>
                <path fill="#121212" floodOpacity=".12" opacity={isActive ? '0' : '1'} d="M22.362 18.381h30.259v31.762H22.362z" />
            </g>
            <defs>
                <filter id="tvvisualfilter0_d" width="102.276" height="75.762" x=".362" y=".381" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="effect1_dropShadow" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix values="0 0 0 0 0.553125 0 0 0 0 0.880083 0 0 0 0 0.983333 0 0 0 0.5 0" />
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
            </defs>
        </svg>
    );
}

export default TvVisual;
