import { Ref, forwardRef } from 'react';
import Image, { ImageProps } from 'next/image';
import type { SupportedColorScheme } from '@signalco/ui/theme';

export type SignalcoLogotypeProps = Omit<ImageProps, 'width' | 'height' | 'alt' | 'src'> & {
    width?: number;
    height?: number;
    theme?: SupportedColorScheme;
}

function SignalcoLogotype({ width, height, theme, ...rest }: SignalcoLogotypeProps, ref: Ref<HTMLImageElement>) {
    const scale = width ? width / 413 : (height ? height / 98 : undefined);
    if (!scale)
        throw new Error('Either height or width must be provided to SignalcoLogo.')

    const w = 413 * scale;
    const h = 98 * scale;

    const urlParams = new URLSearchParams({
        theme: theme ?? 'light',
    });

    return (
        <Image
            ref={ref}
            alt="signalco"
            width={w}
            height={h}
            src={`/api/branding/logotype?${urlParams.toString()}`}
            {...rest} />
    );
}

export default forwardRef<HTMLImageElement, SignalcoLogotypeProps>(SignalcoLogotype);
