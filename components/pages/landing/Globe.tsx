import React, { useContext, useEffect } from "react";
import { AppContext } from "../../../pages/_app";
import createGlobe from "cobe";
import useWindowRect from "../../../src/hooks/useWindowRect";

function Globe() {
    const canvasRef = React.useRef(null);
    const appContext = useContext(AppContext);
    const rect = useWindowRect(typeof window !== 'undefined' ? window : null);
    const width = Math.min(1100, rect?.width ?? 0);
    const height = width;
    const isDark = appContext.theme === 'dark';

    useEffect(() => {
        let phi = 4.1;

        if (!width || !height)
            return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: height * 2,
            phi: phi,
            theta: 0.1,
            dark: isDark ? 1 : 0,
            diffuse: 1.1,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: isDark ? [0.6, 0.6, 0.6] : [1, 1, 1],
            markerColor: [0.1, 0.8, 1],
            glowColor: isDark ? [0, 0, 0] : [1, 1, 1],
            markers: [],
            onRender: (state: { phi: number }) => {
                state.phi = phi;
                phi += 0.0005;
            }
        });

        return () => {
            globe.destroy();
        };
    }, [width, height, isDark]);

    return (
        <canvas ref={canvasRef} style={{ width: width, height: width }}></canvas>
    );
}

export default Globe;