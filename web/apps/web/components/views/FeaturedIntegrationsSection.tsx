'use client';

import { useInView } from 'react-cool-inview';
import React from 'react';
import { Grid, MuiStack } from '@signalco/ui';
import { SectionCenter } from './SectionCenter';
import { Typography } from '@signalco/ui/dist/Typography';
import { GentleSlide } from '@signalco/ui/dist/GentleSlide';
import {ImageLink} from '@signalco/ui/dist/ImageLink';

const integrationsList = [
    { name: 'Samsung', img: '/assets/logos/samsunglogo.png', imgRatio: 3.5, page: '/channels/samsung' },
    { name: 'Xiaomi', img: '/assets/logos/xiaomilogo.png', imgRatio: 1, page: '/channels/xiaomi' },
    { name: 'Philips Hue', img: '/assets/logos/huelogo.png', imgRatio: 1.6, page: '/channels/philipshue' },
    // { name: "Zigbee2MQTT", img: "/assets/logos/z2mlogo.png", imgRatio: 1, page: '/channels/zigbee2mqtt' },
    { name: 'iRobot', img: '/assets/logos/irobotlogo.png', imgRatio: 2.5, page: '/channels/irobot' },
    { name: 'GitHub', img: '/assets/logos/githublogo.png', imgRatio: 2, page: '/channels/github-app' },
    // { name: "Tasmota", img: "/assets/logos/tasmotalogo.png", imgRatio: 1, page: '/channels/tasmota' },
]

const integrationsLogoSize = 60;

export function FeaturedIntegrationsSection() {
    const { observe, inView } = useInView({
        onEnter: ({ unobserve }) => unobserve(), // only run once
    });

    return (
        <SectionCenter>
            <MuiStack spacing={4} ref={observe}>
                <GentleSlide appear={inView} direction="down">
                    <Typography level="body2" textAlign="center" textTransform="uppercase">Featured integrations</Typography>
                </GentleSlide>
                <Grid container alignItems="center" justifyContent="center">
                    {integrationsList.map((channel, channelIndex) => (
                        <Grid key={channel.name} xs={6} md={12 / integrationsList.length} textAlign="center" sx={{ p: 1 }}>
                            <GentleSlide appear={inView} index={channelIndex} direction="down">
                                <ImageLink href={channel.page} imageProps={{
                                    alt: channel.name,
                                    src: channel.img,
                                    width: `${integrationsLogoSize * channel.imgRatio}`,
                                    height: `${integrationsLogoSize * channel.imgRatio}`
                                }} />
                            </GentleSlide>
                        </Grid>
                    ))}
                </Grid>
            </MuiStack>
        </SectionCenter>
    );
}
