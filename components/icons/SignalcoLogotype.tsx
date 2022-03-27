import Image from 'next/image';
import logotypeImage from '../../public/images/logotype.svg';

export default function SignalcoLogotype({ priority, width, height }: { priority?: boolean, width?: number, height?: number }) {
    if (typeof width === 'undefined' &&
        typeof height === 'undefined') {
        throw new Error("Either height or width must be provided to SignalcoLogo.");
    }

    const fixedWidth = width ?? (2810 / 666) * (height ?? 0);
    const fixedHeight = height ?? (666 / 2810) * (width ?? 0);

    return (
        <Image
            src={logotypeImage}
            alt="Signalco logo"
            layout="fixed"
            quality={100}
            priority={priority}
            width={fixedWidth}
            height={fixedHeight} />
    )
}