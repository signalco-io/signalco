import React, { useEffect, useMemo, useRef } from 'react';
import createGlobe from 'cobe';
import { useWindowWidth } from '@signalco/hooks/useWindowWidth';

function Globe() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rectWidth = useWindowWidth();
    const size = Math.min(1100, (rectWidth ?? 0) * 0.8);
    const isDark = false;

    const glow: [number, number, number] = useMemo(() => isDark ? [0.1,0.1,0.1] : [1, 1, 1], [isDark]);
    const base: [number, number, number] = useMemo(() => isDark ? [0.4,0.4,0.4] : [0.90,0.91,0.93], [isDark]);

    useEffect(() => {
        let phi = 4.1;

        if (!size || canvasRef.current == null)
            return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: size * 2,
            height: size * 2,
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
            onRender: (state: Record<string, unknown>) => {
                state.phi = phi;
                phi += 0.0005;
            }
        });

        return () => {
            globe.destroy();
        };
    }, [size, isDark, base, glow]);

    return (
        <canvas ref={canvasRef} style={{ width: size, height: size }}></canvas>
    );
}

export default Globe;
