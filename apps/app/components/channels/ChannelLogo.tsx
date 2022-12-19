import { useState } from 'react';
import Image from 'next/image';

export type ChannelLogoProps = {
    channelName: string;
    label?: string;
};

export default function ChannelLogo({ channelName, label }: ChannelLogoProps) {
    const [noLogo, setNoLogo] = useState(false);
    const logoUrl = noLogo
        ? 'https://www.signalco.io/assets/channels/logos/no-logo.png'
        : `https://www.signalco.io/assets/channels/logos/${channelName}.png`;

    return (
        <Image
            src={logoUrl}
            quality={90}
            alt={`${label ?? channelName}`}
            width={64}
            height={64}
            onError={() => setNoLogo(true)} />
    );
}
