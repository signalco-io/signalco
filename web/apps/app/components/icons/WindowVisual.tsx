/* eslint-disable tailwindcss/no-custom-classname */
import { CSSProperties, useState } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { useInterval } from '@signalco/hooks/useInterval';
import { now } from '../../src/services/DateTimeProvider';
import { colorToRgb } from '../../src/helpers/StringHelpers';

const skySunnyGrads = [
    [{ color: '#00000c', position: 0 }, { color: '#00000c', position: 0 }],
    [{ color: '#020111', position: 85 }, { color: '#191621', position: 100 }],
    [{ color: '#020111', position: 60 }, { color: '#20202c', position: 100 }],
    [{ color: '#020111', position: 10 }, { color: '#3a3a52', position: 100 }],
    [{ color: '#20202c', position: 0 }, { color: '#515175', position: 100 }],
    [{ color: '#40405c', position: 0 }, { color: '#6f71aa', position: 80 }, { color: '#8a76ab', position: 100 }],
    [{ color: '#4a4969', position: 0 }, { color: '#7072ab', position: 50 }, { color: '#cd82a0', position: 100 }],
    [{ color: '#757abf', position: 0 }, { color: '#8583be', position: 60 }, { color: '#eab0d1', position: 100 }],
    [{ color: '#82addb', position: 0 }, { color: '#ebb2b1', position: 100 }],
    [{ color: '#94c5f8', position: 1 }, { color: '#a6e6ff', position: 70 }, { color: '#b1b5ea', position: 100 }],
    [{ color: '#b7eaff', position: 0 }, { color: '#94dfff', position: 100 }],
    [{ color: '#9be2fe', position: 0 }, { color: '#67d1fb', position: 100 }],
    [{ color: '#90dffe', position: 0 }, { color: '#38a3d1', position: 100 }],
    [{ color: '#57c1eb', position: 0 }, { color: '#246fa8', position: 100 }],
    [{ color: '#2d91c2', position: 0 }, { color: '#1e528e', position: 100 }],
    [{ color: '#2473ab', position: 0 }, { color: '#1e528e', position: 70 }, { color: '#5b7983', position: 100 }],
    [{ color: '#1e528e', position: 0 }, { color: '#265889', position: 50 }, { color: '#9da671', position: 100 }],
    [{ color: '#1e528e', position: 0 }, { color: '#728a7c', position: 50 }, { color: '#e9ce5d', position: 100 }],
    [{ color: '#154277', position: 0 }, { color: '#576e71', position: 30 }, { color: '#e1c45e', position: 70 }, { color: '#b26339', position: 100 }],
    [{ color: '#163C52', position: 0 }, { color: '#4F4F47', position: 30 }, { color: '#C5752D', position: 60 }, { color: '#B7490F', position: 80 }, { color: '#2F1107', position: 100 }],
    [{ color: '#071B26', position: 0 }, { color: '#071B26', position: 30 }, { color: '#8A3B12', position: 80 }, { color: '#240E03', position: 100 }],
    [{ color: '#010A10', position: 30 }, { color: '#59230B', position: 80 }, { color: '#2F1107', position: 100 }],
    [{ color: '#090401', position: 50 }, { color: '#4B1D06', position: 100 }],
    [{ color: '#00000c', position: 80 }, { color: '#150800', position: 100 }],
];

function WindowVisual({ size, ...props }: { shadePerc: number, size?: number, dateAndTime?: Date }) {
    const [hours, setHours] = useState(((props.dateAndTime ?? now()).getHours()) % 24);

    // Update hours every minute
    useInterval(() => setHours(((props.dateAndTime ?? now()).getHours()) % 24), 60 * 1000);

    const perc = Math.max(0, Math.min(props.shadePerc || 0, 1));

    const gradData = skySunnyGrads[hours];
    const cssSkyGradStops = gradData?.map((stop, index) => <stop key={index} offset={stop.position / 100} stopColor={`${stop.color}`} />)
    const grdientLastColor = gradData?.at(-1)?.color;
    const castColor = grdientLastColor ? colorToRgb(grdientLastColor) : undefined;
    const castR = (castColor?.r || 0) / 255;
    const castG = (castColor?.g || 0) / 255;
    const castB = (castColor?.b || 0) / 255;
    const castAmount = 0.25 * (1 - perc);

    const shadePosition = 1 + (perc * 64);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cx(
                'mt-2 -mx-4 [&_*]:transition-all',
                Boolean(size) ? 'w-[--visual-size] h-[--visual-size]' : 'w-full h-full'
            )}
            style={{
                '--visual-size': size ? `${size}px` : undefined
            } as CSSProperties}
            fill="none"
            viewBox="0 0 81 104">
            <g className="Theme=Dark, Shades=Mid">
                <path fill="hsl(var(--foreground))" d="M16 1h49v71H16z" className="Frame" />
                <g className="Pane" filter="url(#filter0_d_21:114)">
                    <path fill="url(#windowpaint0_linear_21:114)" d="M19 4h43v65H19z" />
                </g>
                <path stroke="hsl(var(--foreground))" d="M19 36.5h43" className="CrossHorizontal" />
                <path stroke="hsl(var(--foreground))" d="M40.5 69V4" className="CrossVertical" />
                <path stroke="hsl(var(--foreground))" strokeOpacity=".5" d="M17.646 27.203L42.395 2.454" className="Gloss2" />
                <path stroke="hsl(var(--foreground))" strokeOpacity=".5" strokeWidth="4" d="M17.586 32.799L47.991 2.393" className="Gloss1" />
                <g className="WindowShade">
                    <path fill="#666" d={`M19 4h43v${shadePosition}H19z`} className="Shade" />
                    <path fill="#C4C4C4" fillOpacity=".5" d={`M19 ${shadePosition + 2}h43v2H19z`} className="ShadeRod" />
                </g>
            </g>
            <defs>
                <linearGradient id="windowpaint0_linear_21:114" x1="40.5" x2="40.5" y1="4" y2="69" className="windowpaint0_linear_21:114" gradientUnits="userSpaceOnUse">
                    {cssSkyGradStops}
                </linearGradient>
                <filter id="filter0_d_21:114" width="81" height="103" x="0" y="1" className="filter0_d_21:114" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="effect1_dropShadow_21:114" />
                    <feOffset dy="16" />
                    <feGaussianBlur stdDeviation="8.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix values={`0 0 0 0 ${castR.toFixed(5)} 0 0 0 0 ${castG.toFixed(5)} 0 0 0 0 ${castB.toFixed(5)} 0 0 0 ${castAmount.toFixed(3)} 0`} />
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_21:114" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_21:114" result="shape" />
                </filter>
            </defs>
        </svg>
    );
}

export default WindowVisual;
