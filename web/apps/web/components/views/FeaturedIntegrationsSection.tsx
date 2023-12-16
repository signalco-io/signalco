import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@signalco/ui-primitives/Typography';
import { SectionCenter } from './SectionCenter';

const integrationsList = [
    { name: 'Samsung', img: '/assets/logos/samsunglogo.png', scale: 3.5, url: '/channels/samsung' },
    { name: 'Xiaomi', img: '/assets/logos/xiaomilogo.png', scale: 1, url: '/channels/xiaomi' },
    { name: 'Philips Hue', img: '/assets/logos/huelogo.png', scale: 1.6, url: '/channels/philipshue' },
    { name: 'Zigbee2MQTT', img: '/assets/logos/z2mlogo.png', scale: 1, url: '/channels/zigbee2mqtt' },
    { name: 'iRobot', img: '/assets/logos/irobotlogo.png', scale: 2.5, url: '/channels/irobot' },
    { name: 'GitHub', img: '/assets/logos/githublogo.png', scale: 2, url: '/channels/github-app' },
    // { name: "Tasmota", img: "/assets/logos/tasmotalogo.png", scale: 1, page: '/channels/tasmota' },
]

const integrationsLogoSize = 60;

export function FeaturedIntegrationsSection() {
    return (
        <SectionCenter>
            <div className="flex flex-col gap-3">
                <Typography level="body2" center uppercase>Featured integrations</Typography>
                <div className="flex items-center justify-between">
                    {integrationsList.map((channel) => (
                        <Link key={channel.name} href={channel.url} className="text-center transition-opacity duration-200 hover:opacity-75">
                            <Image
                                alt={channel.name}
                                src={channel.img}
                                width={`${integrationsLogoSize * channel.scale}`}
                                height={`${integrationsLogoSize * channel.scale}`} />
                        </Link>
                    ))}
                </div>
            </div>
        </SectionCenter>
    );
}
