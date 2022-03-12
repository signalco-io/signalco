import { Box, Button, Container, Divider, Grid, Stack, SxProps, Theme, Typography } from "@mui/material";
import React, { useContext } from "react";
import Image, { ImageProps } from 'next/image';
import { AppContext } from "./_app";
import logoLight from '../public/images/icon-light-512x512.png';
import logoDark from '../public/images/icon-dark-512x144.png';
import Link from "next/link";
import MuiLink from '@mui/material/Link';
import Footer from "../components/pages/Footer";
import GlobeSection from "../components/pages/landing/GlobeSection";
import Newsletter from "../components/pages/landing/Newsletter";
import CounterIndicator from "../components/pages/landing/CounterIndicator";

const Cover = () => {
  const appContext = useContext(AppContext);

  return (
    <>
      <Box sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        content: '""',
        display: 'block',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'radial-gradient(at top right, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%)',
        backgroundPosition: 'right top'
      }}>
      </Box>
      <Box sx={{
        height: '80vh', display: 'flex', alignItems: 'center', px: '10%', pt: '10vh'
      }}>
        <Stack>
          <Box sx={{ pr: '30%' }}>
            <Image
              src={appContext.theme === 'light' ? logoLight : logoDark}
              alt="signalco"
              priority />
          </Box>
          <Typography component="h2" fontFamily="Raleway" fontWeight={200} fontSize={{ xs: '1.4rem', sm: '2rem', lg: '2.5rem' }}>Automate your life</Typography>
        </Stack>
      </Box>
    </>
  );
};

const Nav = () => (
  <Stack justifyContent="center" direction="row" spacing={{ xs: 4, md: 8 }}>
    <Box sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
      <Link passHref href="/app">
        <Button size="large">
          <Typography variant="h2">Automate</Typography>
        </Button>
      </Link>
    </Box>
    <Box sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
      <Link passHref href="#">
        <Button size="large">
          <Typography variant="h2">Explore</Typography>
        </Button>
      </Link>
    </Box>
    <Box sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
      <Link passHref href="#">
        <Button size="large">
          <Typography variant="h2">Community</Typography>
        </Button>
      </Link>
    </Box>
  </Stack>
);

const FeatureDescription = (props: { title: string, content: string, link?: string, linkText?: string }) => (
  <Box>
    <Stack spacing={2}>
      <Typography fontWeight={600} variant="h2">{props.title}</Typography>
      <Typography sx={{ opacity: 0.8 }}>{props.content}</Typography>
      <Box>
        {props.link && (
          <Link passHref href={props.link}>
            <Button variant="outlined">{props.linkText ?? "Read more"}</Button>
          </Link>
        )}
      </Box>
    </Stack>
  </Box>
);

const StepContent = (props: { title: string, subtitle?: string, imageSrc?: string, children?: React.ReactElement | React.ReactElement[] }) => (
  <SectionCenter>
    <Stack spacing={12}>
      <Stack spacing={4}>
        <Typography fontWeight={600} fontSize={{ xs: 42, md: 52 }} textAlign="center">{props.title}</Typography>
        {props.subtitle && <Typography textAlign="center" sx={{ opacity: 0.6 }}>{props.subtitle}</Typography>}
      </Stack>
      <Stack position="relative" direction="row" spacing={8}>
        {props.imageSrc && (
          <Box width="100%">
          </Box>
        )}
        {props.children && (
          <Stack width="100%" spacing={4} justifyContent="space-evenly">
            {props.children}
          </Stack>
        )}
      </Stack>
    </Stack>
  </SectionCenter>
);

const SectionCenter = (props: { children: React.ReactElement, sx?: SxProps<Theme> | undefined, narrow?: boolean }) => (
  <Box sx={props.sx}>
    <Container>
      <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: { xs: props.narrow ? 4 : 8, sm: props.narrow ? 4 : 12 } }}>
        {props.children}
      </Box>
    </Container>
  </Box>
);

const LinkImage = (props: { href: string, imageProps: ImageProps }) => (
  <Link href={props.href} passHref>
    <MuiLink>
      <Image alt={props.imageProps.alt} {...props.imageProps} />
    </MuiLink>
  </Link>
);

const integrationsList = [
  { name: "Samsung", img: "/assets/logos/samsunglogo.png", imgRatio: 3.5, page: '/channels/samsung' },
  { name: "Xiaomi", img: "/assets/logos/xiaomilogo.png", imgRatio: 1, page: '/channels/xiaomi' },
  { name: "Philips Hue", img: "/assets/logos/huelogo.png", imgRatio: 1.8, page: '/channels/philips-hue' },
  // { name: "Zigbee2MQTT", img: "/assets/logos/z2mlogo.png", imgRatio: 1, page: '/channels/zigbee2mqtt' },
  { name: "iRobot", img: "/assets/logos/irobotlogo.png", imgRatio: 2.5, page: '/channels/irobot' },
  { name: "GitHub", img: "/assets/logos/githublogo.png", imgRatio: 2, page: '/channels/github-app' },
  // { name: "Tasmota", img: "/assets/logos/tasmotalogo.png", imgRatio: 1, page: '/channels/tasmota' },
]

const integrationsLogoSize = 60;

const FeaturedIntegrationsSection = () => (
  <SectionCenter>
    <Stack spacing={4} alignItems="stretch">
      <Typography variant="overline" textAlign="center" fontSize="1em">Featured integrations</Typography>
      <Stack direction="row" spacing={4} alignItems="center" justifyContent="space-between">
        {integrationsList.map(channel => (
          <LinkImage key={channel.name} href={channel.page} imageProps={{
            alt: channel.name,
            src: channel.img,
            width: integrationsLogoSize * channel.imgRatio,
            height: integrationsLogoSize * channel.imgRatio
          }} />
        ))}
      </Stack>
    </Stack>
  </SectionCenter>
);

const Index = () => {
  return (
    <Stack>
      <Cover />
      <Box m={8}>
        <Nav />
      </Box>
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={1} />
      </Box>
      <StepContent title="Discover" imageSrc="/android-chrome-192x192.png">
        <FeatureDescription
          title="Inspiration"
          content="Infinite possibilities." />
        <FeatureDescription
          title="Inspiration"
          content="Infinite possibilities." />
        <FeatureDescription
          title="Integrations"
          content="Connect a wide range of devices and services, from Smart Home and IoT devices to productivity tools and social apps." />
      </StepContent>
      <FeaturedIntegrationsSection />
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={2} />
      </Box>
      <StepContent title="Play" imageSrc="/android-chrome-192x192.png">
        <FeatureDescription
          title="Dashboards"
          content="Make it yours. Feature-rich widgets combined with elegant design will become your playground." />
        <FeatureDescription
          title="Processes"
          content="Automate the smart way." />
        <FeatureDescription
          title="Entities"
          content="Stay organized and regain control with entities." />
      </StepContent>
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={3} hideAfter />
      </Box>
      <StepContent title="Enjoy">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureDescription
              title="Anywhere you are"
              content="Access all features wherever you are. Controlling devices in your home from other side of the world or room :) has never been simpler." />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureDescription
              title="Share"
              content="Not just for you. Share dashboards, devices, media, everything connected, with anyone on signalco or publically. Invite with friends, family, and coworkers. You are in full control over what others can see and do." />
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
        <Stack spacing={{ xs: 6, md: 8 }} alignItems="center" direction={{ xs: "column", md: "row" }} justifyContent={{ xs: "space-between" }}>
          <DataPart value="8" subtitle="Integrations" />
          <DataPart value="500+" subtitle="Automations per day" />
          <DataPart value="2000+" subtitle="Supported devices" />
        </Stack>
      </SectionCenter>
      <Divider />
      <SectionCenter>
        <Newsletter />
      </SectionCenter>
      <Footer />
    </Stack >
  );
};

const DataPart = (props: { value: string, subtitle: string }) => (
  <Stack alignItems="center" spacing={1}>
    <Typography variant="body2" fontWeight={600} fontSize={{ xs: 38, md: 52 }} lineHeight={1}>{props.value}</Typography>
    <Typography variant="overline" fontSize={{ xs: 14, md: 18 }} color="textSecondary" lineHeight={1}>{props.subtitle}</Typography>
  </Stack>
);

export default Index;