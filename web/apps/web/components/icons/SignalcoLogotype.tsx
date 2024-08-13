'use client';

import { useTheme } from 'next-themes';
import Image, { ImageProps } from 'next/image';
import { cx } from '@signalco/ui-primitives/cx';
import type { SupportedColorScheme } from '@signalco/ui/theme';
import { useIsClient } from '@signalco/hooks/useIsClient';

export type SignalcoLogotypeProps = Omit<ImageProps, 'width' | 'height' | 'alt' | 'src'> & {
    width?: number;
    height?: number;
    theme?: SupportedColorScheme;
}

export default function SignalcoLogotype({ width, height, theme, ...rest }: SignalcoLogotypeProps) {
    const { resolvedTheme: activeTheme } = useTheme();
    const resolvedTheme = theme ?? activeTheme;
    const scale = width ? width / 413 : (height ? height / 98 : undefined);
    if (!scale)
        throw new Error('Either height or width must be provided to SignalcoLogo.')

    const w = 413 * scale;
    const h = 98 * scale;

    const urlParams = new URLSearchParams({
        theme: resolvedTheme ?? 'light',
    });

    const isClient = useIsClient();

    return (
        <div style={{ width: w, height: h }} className={cx('transition-opacity', isClient ? 'opacity-100' : 'opacity-0')}>
            {isClient && (
                <Image
                    alt="signalco"
                    width={w}
                    height={h}
                    src={`/api/branding/logotype?${urlParams.toString()}`}
                    {...rest} />
            )}
        </div>
    );
}

