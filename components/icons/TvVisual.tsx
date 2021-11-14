import { useContext } from 'react';
import { AppContext } from '../../pages/_app';
import styles from './TvVisual.module.scss';

const TvVisual = (props: { state: boolean, size: number }) => {
    const appContext = useContext(AppContext);

    const isActive = props.state;
    const screenColor = isActive ? "#378DBD" : "#333";
    const edgeColor = appContext.theme === 'dark' ? "#fff" : "#000";
    const shadowColor = appContext.theme === 'dark' ? "#000" : "#fff";

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.root} width={props.size * 1.6} height={props.size * 1.6} fill="none" viewBox="0 0 103 77">
            <g className="Theme=Dark, State=On">
                <path fill={edgeColor} d="M19 14h65v40.524H19z" className="Edge" />
                <path fill={shadowColor} fillOpacity=".12" d="M19 14h33.621v40.524H19z" className="EdgeShadow" />
                <path fill={edgeColor} d="M39.172 54.524h24.655v3.286H39.172z" className="BaseStand" />
                <path fill={shadowColor} fillOpacity=".12" d="M39.172 54.524H52.62v3.286H39.172z" className="BaseStandShadow" />
                <path fill={edgeColor} d="M32.448 57.809h38.103v2.19H32.448z" className="Base" />
                <path fill={shadowColor} fillOpacity=".12" d="M32.448 57.809H52.62v2.19H32.448z" className="BaseShadow" />
                <g className="Screen" filter={isActive ? "url(#tvvisualfilter0_d)" : ''}>
                    <path fill={screenColor} d="M22.362 18.381h58.276v31.762H22.362z" />
                </g>
                <path fill="#121212" floodOpacity=".12" opacity={isActive ? "0" : "1"} d="M22.362 18.381h30.259v31.762H22.362z" className="ScreenShadow" />
            </g>
            <defs>
                <filter id="tvvisualfilter0_d" width="102.276" height="75.762" x=".362" y=".381" className="tvvisualfilter0_d" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
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