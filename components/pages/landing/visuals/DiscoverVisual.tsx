import { useContext } from 'react';
import { AppContext } from '../../../../pages/_app';

const DiscoverVisual = () => {
    const appContext = useContext(AppContext);

    const connectionsColor = appContext.isDark ? "#555" : "#CECECE";
    const pointsColor = appContext.isDark ? "#777" : "#999";
    const successPointColor = appContext.isDark ? "#537B63" : "#AEFCCD";
    const successIconColor = appContext.isDark ? "#26E773" : "#1FC160";
    const backgroundColor = appContext.isDark ? '#000' : "#fff";

    return (
        <svg width="616" height="616" viewBox="0 0 616 616" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                <line x1="458.428" y1="145.742" x2="555.428" y2="306.742" stroke={connectionsColor} />
                <line x1="355.192" y1="223.538" x2="555.192" y2="306.538" stroke={connectionsColor} />
                <line x1="430.651" y1="427.642" x2="554.651" y2="306.642" stroke={connectionsColor} />
                <line x1="314.985" y1="313.5" x2="554.985" y2="306.5" stroke={connectionsColor} />
                <line x1="72.8859" y1="155.513" x2="281.886" y2="106.513" stroke={connectionsColor} />
                <line x1="169.092" y1="188.509" x2="356.092" y2="223.509" stroke={connectionsColor} />
                <line x1="190" y1="314.5" x2="315" y2="314.5" stroke={connectionsColor} />
                <line x1="89.2092" y1="366.546" x2="241.209" y2="436.546" stroke={connectionsColor} />
                <line x1="143.875" y1="502.516" x2="430.875" y2="428.516" stroke={connectionsColor} />
                <line x1="282.113" y1="106.513" x2="459.113" y2="147.513" stroke={connectionsColor} />
                <line x1="240.572" y1="436.741" x2="314.573" y2="314.741" stroke={connectionsColor} />
                <line x1="189.461" y1="313.805" x2="241.461" y2="436.805" stroke={connectionsColor} />
                <line x1="143.719" y1="502.587" x2="240.719" y2="436.587" stroke={connectionsColor} />
                <line x1="169.327" y1="188.621" x2="315.327" y2="314.621" stroke={connectionsColor} />
                <line x1="356.47" y1="223.828" x2="431.47" y2="428.828" stroke={connectionsColor} />
                <line x1="73.1669" y1="154.529" x2="169.167" y2="188.529" stroke={connectionsColor} />
                <line x1="72.4024" y1="154.703" x2="190.402" y2="314.703" stroke={connectionsColor} />
                <line x1="282.457" y1="107.202" x2="190.457" y2="315.202" stroke={connectionsColor} />
                <line x1="459.297" y1="148.402" x2="356.297" y2="224.402" stroke={connectionsColor} />
                <line x1="315.35" y1="314.643" x2="431.35" y2="428.643" stroke={connectionsColor} />
                <line x1="89.4635" y1="366.813" x2="144.464" y2="502.813" stroke={connectionsColor} />
                <line x1="88.7711" y1="366.555" x2="189.771" y2="314.555" stroke={connectionsColor} />
                <line x1="88.5014" y1="367.038" x2="72.5014" y2="156.038" stroke={connectionsColor} />
                <line x1="144.195" y1="503.46" x2="0.195035" y2="564.46" stroke={connectionsColor} />
                <line x1="143.753" y1="503.434" x2="-0.247413" y2="421.434" stroke={connectionsColor} />
                <line x1="-0.125104" y1="389.516" x2="88.8749" y2="366.516" stroke={connectionsColor} />
                <line x1="0.0855612" y1="281.507" x2="190.086" y2="314.507" stroke={connectionsColor} />
                <line x1="0.254622" y1="88.5697" x2="169.255" y2="188.57" stroke={connectionsColor} />
                <line x1="0.15202" y1="16.5237" x2="282.152" y2="106.524" stroke={connectionsColor} />
                <line x1="-0.161996" y1="180.527" x2="72.838" y2="155.527" stroke={connectionsColor} />
                <line x1="144.142" y1="502.521" x2="323.142" y2="555.521" stroke={connectionsColor} />
                <line x1="321.622" y1="554.673" x2="430.622" y2="428.673" stroke={connectionsColor} />
                <line x1="242.413" y1="436.719" x2="323.413" y2="555.719" stroke={connectionsColor} />
                <line x1="-0.0719972" y1="602.505" x2="322.928" y2="555.505" stroke={connectionsColor} />
                <circle cx="315" cy="315" r="8" fill={pointsColor} />
                <circle cx="241" cy="437" r="8" fill={pointsColor} />
                <circle cx="356" cy="224" r="8" fill={pointsColor} />
                <circle cx="431" cy="429" r="8" fill={pointsColor} />
                <circle cx="144" cy="503" r="8" fill={pointsColor} />
                <circle cx="323" cy="556" r="8" fill={pointsColor} />
                <circle cx="73" cy="156" r="8" fill={pointsColor} />
                <circle cx="190" cy="315" r="8" fill={pointsColor} />
                <circle cx="282" cy="107" r="8" fill={pointsColor} />
                <circle cx="89" cy="367" r="8" fill={pointsColor} />
                <circle cx="169" cy="189" r="8" fill={pointsColor} />
                <circle cx="459" cy="148" r="8" fill={pointsColor} />
                <circle cx="555" cy="307" r="16" fill={successPointColor} />
                <path d="M552 311.17L547.83 307L546.41 308.41L552 314L564 302L562.59 300.59L552 311.17Z" fill={successIconColor} />
                <rect y="616" width="616" height="54" transform="rotate(-90 0 616)" fill="url(#paint0_linear_507_806)" />
            </g>
            <defs>
                <linearGradient id="paint0_linear_507_806" x1="308" y1="616" x2="308" y2="670" gradientUnits="userSpaceOnUse">
                    <stop offset="0.234375" stopColor={backgroundColor} />
                    <stop offset="1" stopColor={backgroundColor} stopOpacity="0.223958" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default DiscoverVisual;
