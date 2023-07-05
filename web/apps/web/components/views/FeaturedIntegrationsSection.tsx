'use client';

import { useInView } from 'react-cool-inview';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@signalco/ui/dist/Typography';
import { GentleSlide } from '@signalco/ui/dist/GentleSlide';
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
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <SectionCenter>
            <div className="flex flex-col gap-3" ref={observe}>
                <GentleSlide appear={inView} direction="down">
                    <Typography level="body2" textAlign="center" textTransform="uppercase">Featured integrations</Typography>
                </GentleSlide>
                <div className="flex items-center">
                    {integrationsList.map((channel, channelIndex) => (
                        <GentleSlide key={channel.name} appear={inView} index={channelIndex} direction="down">
                            <Link href={channel.url} className="hover:opacity-75 transition-opacity duration-200 text-center">
                                <Image
                                    alt={channel.name}
                                    src={channel.img}
                                    width={`${integrationsLogoSize * channel.scale}`}
                                    height={`${integrationsLogoSize * channel.scale}`} />
                            </Link>
                        </GentleSlide>
                    ))}
                </div>
            </div>
        </SectionCenter>
    );
}
