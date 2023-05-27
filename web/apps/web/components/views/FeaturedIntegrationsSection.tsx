'use client';

import { useInView } from 'react-cool-inview';
import React from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { ImageLink } from '@signalco/ui/dist/ImageLink';
import { GentleSlide } from '@signalco/ui/dist/GentleSlide';
import { SectionCenter } from './SectionCenter';

const integrationsList = [
    { name: 'Samsung', img: '/assets/logos/samsunglogo.png', scale: 3.5, page: '/channels/samsung' },
    { name: 'Xiaomi', img: '/assets/logos/xiaomilogo.png', scale: 1, page: '/channels/xiaomi' },
    { name: 'Philips Hue', img: '/assets/logos/huelogo.png', scale: 1.6, page: '/channels/philipshue' },
    { name: 'Zigbee2MQTT', img: '/assets/logos/z2mlogo.png', scale: 1, page: '/channels/zigbee2mqtt' },
    { name: 'iRobot', img: '/assets/logos/irobotlogo.png', scale: 2.5, page: '/channels/irobot' },
    { name: 'GitHub', img: '/assets/logos/githublogo.png', scale: 2, page: '/channels/github-app' },
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
                            <ImageLink
                                href={channel.page}
                                className="text-center"
                                imageProps={{
                                    alt: channel.name,
                                    src: channel.img,
                                    width: `${integrationsLogoSize * channel.scale}`,
                                    height: `${integrationsLogoSize * channel.scale}`
                                }} />
                        </GentleSlide>
                    ))}
                </div>
            </div>
        </SectionCenter>
    );
}
