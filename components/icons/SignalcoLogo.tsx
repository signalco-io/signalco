import { useContext } from "react";
import { AppContext } from "../../pages/_app";
import Image from 'next/image';

export default function SignalcoLogo({ priority, width, height }: { priority?: boolean, width?: number, height?: number }) {
    if (typeof width === 'undefined' &&
        typeof height === 'undefined') {
        throw new Error("Either height or width must be provided to SignalcoLogo.");
    }

    const appContext = useContext(AppContext);

    const fixedWidth = width ?? (512 / 144) * (height ?? 0);
    const fixedHeight = height ?? (144 / 512) * (width ?? 0);

    return (
        <Image
            src={appContext.theme === 'light' ? "/images/icon-light-512x512.png" : "/images/icon-dark-512x144.png"}
            alt="Signalco logo"
            layout="fixed"
            quality={100}
            priority={priority}
            width={fixedWidth}
            height={fixedHeight} />
    )
}