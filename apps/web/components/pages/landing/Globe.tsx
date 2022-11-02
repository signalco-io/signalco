import React, { useEffect, useMemo, useRef } from 'react';
import createGlobe from 'cobe';
import { useColorScheme } from '@mui/joy/styles';
import useWindowWidth from '../../../src/hooks/useWindowWidth';

function Globe() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rectWidth = useWindowWidth();
    const width = Math.min(1100, rectWidth ?? 0);
    const height = width;
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const glow: [number, number, number] = useMemo(() => isDark ? [0.1,0.1,0.1] : [1, 1, 1], [isDark]);
    const base: [number, number, number] = useMemo(() => isDark ? [0.4,0.4,0.4] : [0.9,0.9,0.9], [isDark]);

    useEffect(() => {
        let phi = 4.1;

        if (!width || !height || canvasRef.current == null)
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
            baseColor: base,
            markerColor: [0.1, 0.8, 1],
            glowColor: glow,
            markers: [],
            onRender: (state: Record<string, any>) => {
                state.phi = phi;
                phi += 0.0005;
            }
        });

        return () => {
            globe.destroy();
        };
    }, [width, height, isDark, base, glow]);

    return (
        <canvas ref={canvasRef} style={{ width: width, height: width }}></canvas>
    );
}

export default Globe;
