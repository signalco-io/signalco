'use client';

import { useInView } from 'react-cool-inview';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { GitHub, Navigate } from '@signalco/ui-icons';
import { Container, ImageLink, Button, Divider, Typography, Grid, Box, Fade, GentleSlide } from '@signalco/ui';
import { Stack, SxProps, Theme } from '@mui/system';
import DeveloperOnly from '../shared/DeveloperOnly';
import DiscoverVisual from '../pages/landing/visuals/DiscoverVisual';
import Cover from '../pages/landing/Cover';
import CounterIndicator from '../pages/landing/CounterIndicator';
import CtaSection from '../pages/CtaSection';

const Newsletter = dynamic(() => import('../pages/landing/Newsletter'));
const GlobePart = dynamic(() => import('../pages/landing/GlobeSection'));

function FeatureDescription(props: { header: string, content: string | React.ReactElement, link?: string, linkText?: string }) {
  return (
    <Stack spacing={2}>
      <Typography level="h5" component="h3">{props.header}</Typography>
      <Typography textColor="neutral.400">{props.content}</Typography>
      <div>
        {props.link && (
          <Link passHref href={props.link}>
            <Button variant="outlined">{props.linkText ?? 'Read more'}</Button>
          </Link>
        )}
      </div>
    </Stack>
  );
}

function StepContent(props: {
  header: string;
  direction?: 'vertical' | 'horizontal'
  subtitle?: string;
  image?: React.ReactNode,
  imageContainerHeight?: number,
  imageContainerStyles?: SxProps | undefined,
  children?: React.ReactNode | React.ReactNode[];
}) {
  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(), // only run once
  });

  return (
    <SectionCenter>
      <Stack spacing={{ xs: 6, md: 12 }} ref={observe}>
        <Stack spacing={{ xs: 2, md: 4 }}>
          <GentleSlide appear={inView} direction="down">
            <Typography level="h3" component="h2" textAlign="center">{props.header}</Typography>
          </GentleSlide>
          {props.subtitle && (
            <GentleSlide appear={inView} direction="down" index={1}>
              <Typography level="body2" textAlign="center">{props.subtitle}</Typography>
            </GentleSlide>
          )}
        </Stack>
        <div>
          <Grid container spacing={8} alignItems="center">
            {props.image && (
              <Grid xs={12} md={6} sx={{ position: 'relative', height: props.imageContainerHeight }}>
                <Fade appear={inView} duration={1400}>
                  <Box sx={props.imageContainerStyles}>
                    {props.image}
                  </Box>
                </Fade>
              </Grid>
            )}
            {props.children && (
              <Grid xs={12} md={props.image ? 6 : 12}>
                <Stack
                  sx={{
                    gap: 4,
                    flexDirection: props.direction === 'horizontal' ? { xs: 'column', md: 'row' } : 'colum'
                  }}>
                  {(Array.isArray(props.children) ? props.children : [props.children]).map((child, childIndex) => (
                    <GentleSlide
                      key={childIndex}
                      appear={inView}
                      index={childIndex}>
                      {child}
                    </GentleSlide>
                  ))}
                </Stack>
              </Grid>
            )}
          </Grid>
        </div>
      </Stack>
    </SectionCenter>
  );
}

function SectionCenter(props: { children?: React.ReactNode | undefined, sx?: SxProps<Theme> | undefined, narrow?: boolean }) {
  return (
    <Box sx={props.sx} component="section">
      <Container>
        <Box sx={{ px: { xs: 1, sm: 4, md: 8 }, py: { xs: props.narrow ? 4 : 8, sm: props.narrow ? 4 : 12 } }}>
          {props.children}
        </Box>
      </Container>
    </Box>
  );
}

const integrationsList = [
  { name: 'Samsung', img: '/assets/logos/samsunglogo.png', imgRatio: 3.5, page: '/channels/samsung' },
  { name: 'Xiaomi', img: '/assets/logos/xiaomilogo.png', imgRatio: 1, page: '/channels/xiaomi' },
  { name: 'Philips Hue', img: '/assets/logos/huelogo.png', imgRatio: 1.6, page: '/channels/philips-hue' },
  // { name: "Zigbee2MQTT", img: "/assets/logos/z2mlogo.png", imgRatio: 1, page: '/channels/zigbee2mqtt' },
  { name: 'iRobot', img: '/assets/logos/irobotlogo.png', imgRatio: 2.5, page: '/channels/irobot' },
  { name: 'GitHub', img: '/assets/logos/githublogo.png', imgRatio: 2, page: '/channels/github-app' },
  // { name: "Tasmota", img: "/assets/logos/tasmotalogo.png", imgRatio: 1, page: '/channels/tasmota' },
]

const integrationsLogoSize = 60;

function FeaturedIntegrationsSection() {
  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(), // only run once
  });

  return (
    <SectionCenter>
      <Stack spacing={4} ref={observe}>
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
      </Stack>
    </SectionCenter>
  );
}

function NewsletterSection() {
  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(), // only run once
  });

  return (
    <div ref={observe}>
      <SectionCenter>
        {inView && <Newsletter />}
      </SectionCenter>
    </div>
  );
}

function GlobeSection() {
  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(), // only run once
  });

  return (
    <Box ref={observe} sx={{ minHeight: { xs: '12vh', sm: '20vh', md: '380px' }, }}>
      {inView && <GlobePart />}
    </Box>
  );
}

function PlaySection() {
  return (
    <StepContent header="Play" subtitle="Here are some of our favorite ways you can automate your life"
      image={
        <>
          <Image className="image--light" src={'/images/playpitch.png'} alt="Play" quality={100} width={511} height={684} />
          <Image className="image--dark" src={'/images/playpitch-dark.png'} alt="Play" quality={100} width={511} height={684} />
        </>
      }
      imageContainerHeight={684 + 64}
      imageContainerStyles={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '511px',
        height: '684px',
        marginTop: '64px'
      }}>
      <FeatureDescription
        header="Morning coffee"
        content="Raise the shades, play your favorite energizing morning beat and turn on the coffee maker." />
      <FeatureDescription
        header="Busywork"
        content="Create a list of Trello cards and GitHub tasks that need your attention today. Maybe you can automate some of them too." />
      <FeatureDescription
        header="TV time"
        content="Dim the lights, switch the TV to Netflix, and turn on do-not-disturb on your phone. Now is You time." />
      <FeatureDescription
        header="Rain alert"
        content="Notify me if today's forecast shows rain and windows are open. Ease your mind knowing you will get notified on time" />
    </StepContent>
  );
}

function DataPart(props: { value: string, subtitle: string }) {
  return <Stack alignItems="center" spacing={1}>
    <Typography level="h3" component="span" lineHeight={1}>{props.value}</Typography>
    <Typography textTransform="uppercase" textColor="text.secondary" lineHeight={1}>{props.subtitle}</Typography>
  </Stack>
}

export default function LandingPageView() {
  return (
    <Stack sx={{ overflowX: 'hidden' }}>
      <Box my={2}>
        <Cover />
      </Box>
      <DeveloperOnly>
        <CounterIndicator count={0} />
        <StepContent
          header="Developers"
          subtitle="Signalco is free and open source project run by small team of enthusiasts."
          direction="horizontal">
          <Stack alignItems="center">
            <Button
              variant="solid"
              startDecorator={<GitHub />}
              endDecorator={<Navigate />}
              href="https://github.com/signalco-io"
              size="lg">signalco on GitHub</Button>
          </Stack>
        </StepContent>
      </DeveloperOnly>
      <CounterIndicator count={1} />
      <StepContent header="Discover" image={<DiscoverVisual />} imageContainerHeight={420}
        imageContainerStyles={{
          position: 'absolute',
          top: '-92px',
          right: 0,
          zIndex: -1
        }}>
        <FeatureDescription
          header="Bring together"
          content="Every service and device is useful by itself, but the real magic happens when you bring them all together." />
        <FeatureDescription
          header="Connected"
          content="Connect a wide range of devices and services, from Smart Home and IoT devices to productivity tools and social apps." />
        <FeatureDescription
          header="Automation"
          content="Repetitive tasks are boring. Automate so you can focus on things that matter to you." />
      </StepContent>
      <FeaturedIntegrationsSection />
      <CounterIndicator count={2} />
      <PlaySection />
      <CounterIndicator count={3} hideAfter />
      <StepContent header="Enjoy" direction="horizontal">
        <FeatureDescription
          header="Anywhere you are"
          content="Access all features wherever you are. Controlling devices in your home from other side of the world or room&nbsp;:) has never been simpler." />
        <FeatureDescription
          header="Share"
          content="Share devices, media, dashboards, everything connected, with anyone on signalco or publically. Invite with friends, family, and coworkers. You are in full control over what others can see and do." />
        <FeatureDescription
          header="Relax"
          content="Enjoy the automated life. Use gained free time doing what you love. Relax in nature, hobbies, family... or automate one more thing." />
      </StepContent>
      <GlobeSection />
      <Divider />
      <SectionCenter narrow sx={{ bgcolor: 'background.paper' }}>
        <Stack
          spacing={{ xs: 6, md: 8 }}
          alignItems="center"
          direction={{ xs: 'column', md: 'row' }}
          justifyContent={{ xs: 'space-between' }}>
          <DataPart value="8" subtitle="Integrations" />
          <DataPart value="500+" subtitle="Automations per day" />
          <DataPart value="2000+" subtitle="Supported devices" />
        </Stack>
      </SectionCenter>
      <Divider />
      <NewsletterSection />
      <Container>
        <Box sx={{ pb: 8 }}>
          <CtaSection />
        </Box>
      </Container>
    </Stack >
  );
}
