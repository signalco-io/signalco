import { CSSProperties } from 'react';
import { cx } from '@signalco/ui-primitives/cx';

export default function FanVisual({ size, state }: { state: boolean, size?: number }) {
    const isActive = state;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cx(
                'mt-2 [&_*]:transition-all',
                isActive && 'animate-spin [animation-direction:reverse] [animation-duration:5s] [transform-origin:41px_47px]',
                Boolean(size) ? 'w-[--visual-size] h-[--visual-size]' : 'w-full h-full'
            )}
            style={{
                '--visual-size': size ? `${size}px` : undefined
            } as CSSProperties}
            fill="none"
            viewBox="0 0 72 72"
        >
            <path
                fill="#666"
                d="M41.452 33.6h-9.074c0-4.8.907-14.4-4.537-21.6-4.088-5.406 1.512-7.2 4.537-7.2h9.074c11.342 0 5.67 21.6 0 28.8z"
            ></path>
            <mask
                id="mask0_1105_1175"
                style={{ maskType: 'alpha' }}
                width="22"
                height="30"
                x="26"
                y="4"
                maskUnits="userSpaceOnUse"
            >
                <path
                    fill="hsl(var(--foreground))"
                    d="M41.452 33.6h-9.074c0-4.8.907-14.4-4.537-21.6-4.088-5.406 1.512-7.2 4.537-7.2h9.074c11.342 0 5.67 21.6 0 28.8z"
                ></path>
            </mask>
            <g mask="url(#mask0_1105_1175)">
                <path
                    fill="hsl(var(--foreground))"
                    d="M46.469 33.6H34.37c0-6 1.21-18-6.049-27-5.45-6.757 2.017-9 6.05-9h12.098c15.123 0 7.561 27 0 36z"
                ></path>
            </g>
            <path
                fill="#666"
                d="M28.216 41.671l4.537 7.858c-4.157 2.4-12.925 6.414-16.438 14.73-2.638 6.242-6.992 2.29-8.504-.33l-4.537-7.858c-5.67-9.823 15.87-15.711 24.942-14.4z"
            ></path>
            <mask
                id="mask1_1105_1175"
                style={{ maskType: 'alpha' }}
                width="31"
                height="27"
                x="2"
                y="41"
                maskUnits="userSpaceOnUse"
            >
                <path
                    fill="hsl(var(--foreground))"
                    d="M28.216 41.671l4.537 7.858c-4.157 2.4-12.925 6.414-16.438 14.73-2.638 6.242-6.992 2.29-8.504-.33l-4.537-7.858c-5.67-9.823 15.87-15.711 24.942-14.4z"
                ></path>
            </mask>
            <g mask="url(#mask1_1105_1175)">
                <path
                    fill="hsl(var(--foreground))"
                    d="M25.64 38.197l5.597 9.695c-5.115 2.954-15.906 7.891-20.221 18.138-3.24 7.694-8.606 2.815-10.472-.417l-5.598-9.695c-6.996-12.12 19.522-19.35 30.694-17.721z"
                ></path>
            </g>
            <path
                fill="#666"
                d="M39.274 49.035l4.537-7.858c4.157 2.4 12.017 7.986 20.975 6.87 6.725-.836 5.479 4.91 3.967 7.53l-4.537 7.858c-5.671 9.823-21.542-5.889-24.942-14.4z"
            ></path>
            <mask
                id="mask2_1105_1175"
                style={{ maskType: 'alpha' }}
                width="31"
                height="26"
                x="39"
                y="41"
                maskUnits="userSpaceOnUse"
            >
                <path
                    fill="hsl(var(--foreground))"
                    d="M39.274 49.035l4.537-7.858c4.157 2.4 12.017 7.986 20.975 6.87 6.725-.836 5.479 4.91 3.967 7.53l-4.537 7.858c-5.671 9.823-21.542-5.889-24.942-14.4z"
                ></path>
            </mask>
            <g mask="url(#mask2_1105_1175)">
                <path
                    fill="hsl(var(--foreground))"
                    d="M35.04 51.285l5.32-9.214c5.089 2.938 14.735 9.736 25.561 8.614 8.128-.842 6.747 5.944 4.974 9.015l-5.32 9.215c-6.65 11.519-26.227-7.463-30.536-17.63z"
                ></path>
            </g>
            <circle cx="36" cy="40.8" r="9.6" fill="#666"></circle>
        </svg>
    );
}
