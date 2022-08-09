import { useState } from 'react';
import Image from 'next/image';

export default function ChannelLogo(props: { id: string; label?: string; }) {
    const { id, label } = props;
    const [noLogo, setNoLogo] = useState(false);
    const logoUrl = noLogo ? '/assets/channels/logos/no-logo.png' : `/assets/channels/logos/${id}.png`;

    return <Image src={logoUrl} quality={90} alt={`${label ?? id}`} width={64} height={64} layout="fixed" onError={() => setNoLogo(true)} />;
}
