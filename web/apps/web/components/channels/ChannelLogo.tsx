import { useState } from 'react';
import Image from 'next/image';

export type ChannelLogoProps = {
    channelName: string;
    label?: string;
};

export default function ChannelLogo({ channelName, label }: ChannelLogoProps) {
    const [noLogo, setNoLogo] = useState(false);
    const logoUrl = noLogo
        ? '/assets/channels/logos/no-logo.png'
        : `/assets/channels/logos/${channelName}.png`;

    return (
        <Image
            src={logoUrl}
            quality={90}
            alt={`${label ?? channelName}`}
            width={64}
            height={64}
            style={{ objectFit: 'contain' }}
            onError={() => setNoLogo(true)} />
    );
}
