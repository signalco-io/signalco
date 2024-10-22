'use client';

import { useState } from 'react';
import Image from 'next/image';

export type ChannelLogoProps = {
    channelName: string;
    label?: string;
    size?: 'tiny' | 'normal'
};

export default function ChannelLogo({ channelName, label, size }: ChannelLogoProps) {
    const [noLogo, setNoLogo] = useState(false);
    const logoUrl = noLogo
        ? 'https://www.signalco.io/assets/channels/logos/no-logo.png'
        : `https://www.signalco.io/assets/channels/logos/${channelName}.png`;

    let imageSize = 64;
    if (size === 'tiny') {
        imageSize = 24;
    }

    return (
        <Image
            title={label}
            src={logoUrl}
            quality={90}
            alt={`${label ?? channelName}`}
            width={imageSize}
            height={imageSize}
            style={{ objectFit: 'contain' }}
            onError={() => setNoLogo(true)} />
    );
}
