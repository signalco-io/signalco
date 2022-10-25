import { useState } from 'react';
import Image from "next/image";

export default function ChannelLogo(props: { channelName: string; label?: string; }) {
    const { channelName, label } = props;
    const [noLogo, setNoLogo] = useState(false);
    const logoUrl = noLogo ? '/assets/channels/logos/no-logo.png' : `/assets/channels/logos/${channelName}.png`;

    return <Image
        src={logoUrl}
        quality={90}
        alt={`${label ?? channelName}`}
        width={64}
        height={64}
        onError={() => setNoLogo(true)} />;
}
