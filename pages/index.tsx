import { Box, Button, Container, Divider, Grid, Stack, SxProps, Theme, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import Footer from "../components/pages/Footer";
import GlobeSection from "../components/pages/landing/GlobeSection";
import Newsletter from "../components/pages/landing/Newsletter";
import CounterIndicator from "../components/pages/landing/CounterIndicator";
import Cover from "../components/pages/landing/Cover";
import CoverNav from "../components/pages/landing/CoverNav";
import LinkImage from "../components/shared/ImageLink";

const FeatureDescription = (props: { title: string, content: string, link?: string, linkText?: string }) => (
  <Stack spacing={2}>
    <Typography fontWeight={600} variant="h2">{props.title}</Typography>
    <Typography color="textSecondary">{props.content}</Typography>
    <Box>
      {props.link && (
        <Link passHref href={props.link}>
          <Button variant="outlined">{props.linkText ?? "Read more"}</Button>
        </Link>
      )}
    </Box>
  </Stack>
);

const StepContent = (props: { title: string, subtitle?: string, imageSrc?: string, children?: React.ReactElement | React.ReactElement[] }) => (
  <SectionCenter>
    <Stack spacing={12}>
      <Stack spacing={4}>
        <Typography fontWeight={600} fontSize={{ xs: 42, md: 52 }} textAlign="center">{props.title}</Typography>
        {props.subtitle && <Typography variant="subtitle1" textAlign="center" color="textSecondary">{props.subtitle}</Typography>}
      </Stack>
      <Stack position="relative" direction={{ xs: 'column', sm: 'row' }} spacing={8}>
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
      <Box sx={{ px: { xs: 1, sm: 4, md: 8 }, py: { xs: props.narrow ? 4 : 8, sm: props.narrow ? 4 : 12 } }}>
        {props.children}
      </Box>
    </Container>
  </Box>
);

const integrationsList = [
  { name: "Samsung", img: "/assets/logos/samsunglogo.png", imgRatio: 3.5, page: '/channels/samsung' },
  { name: "Xiaomi", img: "/assets/logos/xiaomilogo.png", imgRatio: 1, page: '/channels/xiaomi' },
  { name: "Philips Hue", img: "/assets/logos/huelogo.png", imgRatio: 1.6, page: '/channels/philips-hue' },
  // { name: "Zigbee2MQTT", img: "/assets/logos/z2mlogo.png", imgRatio: 1, page: '/channels/zigbee2mqtt' },
  { name: "iRobot", img: "/assets/logos/irobotlogo.png", imgRatio: 2.5, page: '/channels/irobot' },
  { name: "GitHub", img: "/assets/logos/githublogo.png", imgRatio: 2, page: '/channels/github-app' },
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
  </SectionCenter >
);

const Index = () => {
  return (
    <Stack>
      <Cover />
      <Box m={8}>
        <CoverNav />
      </Box>
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={1} />
      </Box>
      <StepContent title="Discover" imageSrc="/android-chrome-192x192.png">
        <FeatureDescription
          title="Automation"
          content="Maybe you don't need to do it once again. Automate so you can focus on things that interest you." />
        <FeatureDescription
          title="Connected"
          content="Connect a wide range of devices and services, from Smart Home and IoT devices to productivity tools and social apps." />
      </StepContent>
      <FeaturedIntegrationsSection />
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={2} />
      </Box>
      <StepContent title="Play" subtitle="Here are some of our favorite ways you can automate your life" imageSrc="/android-chrome-192x192.png">
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