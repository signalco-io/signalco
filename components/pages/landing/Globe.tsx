import React, { useContext, useEffect, useMemo, useRef } from 'react';
import Color from 'color';
import createGlobe from 'cobe';
import theme from '../../../src/theme';
import useWindowWidth from '../../../src/hooks/useWindowWidth';
import { colorToRgb } from '../../../src/helpers/StringHelpers';
import { ThemeContext } from '../../../pages/_app';

function Globe() {
    const canvasRef = useRef(null);
    const themeContext = useContext(ThemeContext);
    const rectWidth = useWindowWidth();
    const width = Math.min(1100, rectWidth ?? 0);
    const height = width;
    const isDark = themeContext.isDark;
    const scheme = useMemo(() => isDark
        ? theme(themeContext.theme).colorSchemes.dark
        : theme(themeContext.theme).colorSchemes.light, [isDark, themeContext.theme]);

    const glow = colorToRgb(scheme.palette.background.default);
    const base = Color(scheme.palette.background.default).lightness(128).rgb().object();

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
            baseColor: [base.r / 255, base.g / 255, base.b / 255],
            markerColor: [0.1, 0.8, 1],
            glowColor: [glow.r / 255, glow.g / 255, glow.b / 255],
            markers: [],
            onRender: (state: { phi: number }) => {
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
