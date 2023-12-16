import Image, { ImageProps } from 'next/image';
import { SupportedColorScheme } from '@signalco/ui/theme';

export type SignalcoLogoProps = Omit<ImageProps, 'width' | 'height' | 'alt' | 'src'> & {
    width?: number;
    height?: number;
    theme?: SupportedColorScheme;
}

export default function SignalcoLogo({ width, height, theme, ...rest }: SignalcoLogoProps) {
    const scale = width ? width / 414 : (height ? height / 426 : undefined);
    if (!scale)
        throw new Error('Either height or width must be provided to SignalcoLogo.')

    const w = 414 * scale;
    const h = 426 * scale;

    const urlParams = new URLSearchParams({
        theme: theme ?? 'light',
    });

    return (
        <Image
            alt="signalco"
            width={w}
            height={h}
            src={`/api/branding/logotype?${urlParams.toString()}`}
            {...rest} />
    );
}
