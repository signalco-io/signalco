'use client';

import { useTheme } from 'next-themes';
import Image, { ImageProps } from 'next/image';
import { cx } from '@signalco/ui-primitives/cx';
import { SupportedColorScheme } from '@signalco/ui/theme';
import { useIsClient } from '@signalco/hooks/useIsClient';

export type SignalcoLogoProps = Omit<ImageProps, 'width' | 'height' | 'alt' | 'src'> & {
    width?: number;
    height?: number;
    theme?: SupportedColorScheme;
}

export default function SignalcoLogo({ width, height, theme, ...rest }: SignalcoLogoProps) {
    const { resolvedTheme: activeTheme } = useTheme();
    const resolvedTheme = theme ?? activeTheme;
    const scale = width ? width / 414 : (height ? height / 426 : undefined);
    if (!scale)
        throw new Error('Either height or width must be provided to SignalcoLogo.')

    const w = 414 * scale;
    const h = 426 * scale;

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
                    src={`/api/branding/logo?${urlParams.toString()}`}
                    {...rest} />
            )}
        </div>
    );
}
