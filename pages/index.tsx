import { Box, Button, Container, Divider, Grid, Stack, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import CounterIndicator from '../components/pages/landing/CounterIndicator';
import Cover from '../components/pages/landing/Cover';
import LinkImage from '../components/shared/ImageLink';
import { PageFullLayout } from '../components/layouts/PageFullLayout';
import { useInView } from 'react-cool-inview';
import dynamic from 'next/dynamic';
import DiscoverVisual from '../components/pages/landing/visuals/DiscoverVisual';
import Image from 'next/image';
import { useContext } from 'react';
import { AppContext } from './_app';
import { GitHub, KeyboardArrowRight } from '@mui/icons-material';
import AppSettingsProvider from '../src/services/AppSettingsProvider';

const Newsletter = dynamic(() => import('../components/pages/landing/Newsletter'));
const GlobePart = dynamic(() => import('../components/pages/landing/GlobeSection'));

const FeatureDescription = (props: { title: string, content: string | React.ReactElement, link?: string, linkText?: string }) => (
  <Stack spacing={2}>
    <Typography fontWeight={600} variant="h2">{props.title}</Typography>
    <Typography color="textSecondary">{props.content}</Typography>
    <Box>
      {props.link && (
        <Link passHref href={props.link}>
          <Button variant="outlined">{props.linkText ?? 'Read more'}</Button>
        </Link>
      )}
    </Box>
  </Stack>
);

function StepContent(props: { title: string; subtitle?: string; image?: React.ReactNode, imageContainerHeight?: number, imageContainerStyles?: SxProps | undefined, children?: React.ReactNode | React.ReactNode[]; }) {
  return (
    <SectionCenter>
      <Stack spacing={{ xs: 6, md: 12 }}>
        <Stack spacing={{ xs: 2, md: 4 }}>
          <Typography fontWeight={600} fontSize={{ xs: 42, md: 52 }} textAlign="center">{props.title}</Typography>
          {props.subtitle && <Typography variant="subtitle1" textAlign="center" color="textSecondary">{props.subtitle}</Typography>}
        </Stack>
        <Box>
          <Grid container spacing={8} alignItems="center">
            {props.image && (
              <Grid item xs={12} md={6} sx={{ position: 'relative', height: props.imageContainerHeight }}>
                <Box sx={props.imageContainerStyles}>
                  {props.image}
                </Box>
              </Grid>
            )}
            {props.children && (
              <Grid item xs={12} md={props.image ? 6 : 12}>
                <Stack width="100%" spacing={4} justifyContent="space-evenly">
                  {props.children}
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>
      </Stack>
    </SectionCenter>
  );
}

const SectionCenter = (props: { children?: React.ReactNode | undefined, sx?: SxProps<Theme> | undefined, narrow?: boolean }) => (
  <Box sx={props.sx}>
    <Container>
      <Box sx={{ px: { xs: 1, sm: 4, md: 8 }, py: { xs: props.narrow ? 4 : 8, sm: props.narrow ? 4 : 12 } }}>
        {props.children}
      </Box>
    </Container>
  </Box>
);

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

const FeaturedIntegrationsSection = () => (
  <SectionCenter>
    <Stack spacing={4}>
      <Typography variant="overline" textAlign="center" fontSize="1em">Featured integrations</Typography>
      <Grid container alignItems="center" justifyContent="center">
        {integrationsList.map(channel => (
          <Grid item key={channel.name} xs={6} md={12 / integrationsList.length} textAlign="center" sx={{ p: 1 }}>
            <LinkImage href={channel.page} imageProps={{
              alt: channel.name,
              src: channel.img,
              width: `${integrationsLogoSize * channel.imgRatio}`,
              height: `${integrationsLogoSize * channel.imgRatio}`
            }} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  </SectionCenter>
);

const NewsletterSection = () => {
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
};

const GlobeSection = () => {
  const { observe, inView } = useInView({
    onEnter: ({ unobserve }) => unobserve(), // only run once
  });

  return (
    <Box ref={observe} sx={{ minHeight: { xs: '12vh', sm: '20vh', md: '380px' }, }}>
      {inView && <GlobePart />}
    </Box>
  );
};

const PlaySection = () => {
  const appContext = useContext(AppContext);

  return (
    <StepContent title="Play" subtitle="Here are some of our favorite ways you can automate your life"
      image={<Image layout="fixed" src={appContext.isDark ? '/images/playpitch-dark.png' : '/images/playpitch.png'} alt="Play" quality={100} width={511} height={684} />}
      imageContainerHeight={684 + 64}
      imageContainerStyles={{ position: 'absolute', top: 0, right: 0, width: '511px', height: '684px', marginTop: '64px' }}>
      <FeatureDescription
        title="Morning coffee"
        content="Raise the shades, play your favorite energizing morning beat and turn on the coffee maker." />
      <FeatureDescription
        title="Busywork"
        content="Create a list of Trello cards and GitHub tasks that need your attention today. Maybe you can automate some of them too." />
      <FeatureDescription
        title="TV time"
        content="Dim the lights, switch the TV to Netflix, and turn on do-not-disturb on your phone. Now is You time." />
      <FeatureDescription
        title="Rain alert"
        content="Notify me if today's forecast shows rain and windows are open. Ease your mind knowing you will get notified on time" />
    </StepContent>
  );
};

const Index = () => {
  return (
    <Stack sx={{ overflowX: 'hidden' }}>
      <Box my={2}>
        <Cover />
      </Box>
      {AppSettingsProvider.isDeveloper && (
        <>
          <Box sx={{ margin: 'auto' }}>
            <CounterIndicator count={0} />
          </Box>
          <StepContent title="Developers" subtitle="Signalco is free and open source project run by small team of enthusiasts.">
            <Stack alignItems="center">
              <Button variant="outlined" startIcon={<GitHub />} endIcon={<KeyboardArrowRight />} href="https://github.com/signalco-io" size="large">signalco on GitHub</Button>
            </Stack>
          </StepContent>
        </>
      )}
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={1} />
      </Box>
      <StepContent title="Discover" image={<DiscoverVisual />} imageContainerHeight={420} imageContainerStyles={{ position: 'absolute', top: '-92px', right: 0, zIndex: -1 }}>
        <FeatureDescription
          title="Bring together"
          content="Every service and device is useful by itself, but the real magic happens when you bring them all together." />
        <FeatureDescription
          title="Connected"
          content="Connect a wide range of devices and services, from Smart Home and IoT devices to productivity tools and social apps." />
        <FeatureDescription
          title="Automation"
          content="Repetitive tasks are boring. Automate so you can focus on things that matter to you." />
      </StepContent>
      <FeaturedIntegrationsSection />
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={2} />
      </Box>
      <PlaySection />
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={3} hideAfter />
      </Box>
      <StepContent title="Enjoy">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureDescription
              title="Anywhere you are"
              content="Access all features wherever you are. Controlling devices in your home from other side of the world or room&nbsp;:) has never been simpler." />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureDescription
              title="Share"
              content="Share devices, media, dashboards, everything connected, with anyone on signalco or publically. Invite with friends, family, and coworkers. You are in full control over what others can see and do." />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureDescription
              title="Relax"
              content="Enjoy the automated life. Use gained free time doing what you love. Relax in nature, hobbies, family... or automate one more thing." />
          </Grid>
        </Grid>
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
    </Stack >
  );
};

const DataPart = (props: { value: string, subtitle: string }) => (
  <Stack alignItems="center" spacing={1}>
    <Typography variant="body2" fontWeight={600} fontSize={{ xs: 38, md: 52 }} lineHeight={1}>{props.value}</Typography>
    <Typography variant="overline" fontSize={{ xs: 14, md: 18 }} color="textSecondary" lineHeight={1}>{props.subtitle}</Typography>
  </Stack>
);

Index.layout = PageFullLayout;

export default Index;
