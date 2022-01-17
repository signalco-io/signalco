import { Box, Container, Divider, Grid, IconButton, Link, Stack, Typography } from "@mui/material";
import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';
import { AppContext } from "./_app";
import logoLight from '../public/images/icon-light-512x512.png';
import logoDark from '../public/images/icon-dark-512x144.png';

const Cover = () => (
  <AppContext.Consumer>
    {appState => (
      <>
        <Box sx={
          {
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
          }
        }>
        </Box>
        <Box sx={{
          height: '80vh', display: 'flex', alignItems: 'center', px: '10%', pt: '10vh'
        }}>
          <Stack>
            <Box sx={{ pr: '30%' }}>
              <Image
                src={appState.theme === 'light' ? logoLight : logoDark}
                alt="signalco"
                priority />
            </Box>
            <Typography fontFamily="Raleway" fontWeight={200} fontSize={{ xs: '1.4rem', sm: '2rem', lg: '2.5rem' }}>Automate your life</Typography>
          </Stack>
        </Box>
      </>
    )}
  </AppContext.Consumer >
);

const Nav = () => (
  <Stack justifyContent="center" direction="row" spacing={{ xs: 4, md: 8 }}>
    <Link href="/app" sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
      <Typography variant="h2">Automate</Typography>
    </Link>
    <Link href="#" sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
      <Typography variant="h2">Explore</Typography>
    </Link>
    <Link href="#" sx={{ width: '150px', textAlign: 'center', textDecoration: 'none' }}>
      <Typography variant="h2">Community</Typography>
    </Link>
  </Stack>
);

const CounterIndicator = (props: { count: number, hideAfter?: boolean }) => (
  <AppContext.Consumer>
    {appState => (
      <Box sx={{ display: 'flex', width: '42px', height: props.hideAfter ? '106px' : '170px', alignItems: props.hideAfter ? 'end' : 'center' }}>
        <Box sx={{
          pt: 0.5,
          width: '42px',
          height: '42px',
          borderRadius: '21px',
          color: 'background.default',
          backgroundColor: 'text.primary',
          position: 'relative',
          userSelect: 'none',
          '&::before': {
            content: '""',
            display: 'block',
            height: '64px',
            width: '1px',
            background: `linear-gradient(180deg, ${appState.theme === 'dark' ? '#ffffff' : '#000000'} 67.19%, rgba(255, 255, 255, 0) 100%)`,
            position: 'absolute',
            left: '20px',
            top: '-64px',
            transform: 'rotate(-180deg)'
          },
          '&::after': !props.hideAfter ? {
            content: '""',
            display: 'block',
            height: '64px',
            width: '1px',
            background: `linear-gradient(180deg, ${appState.theme === 'dark' ? '#ffffff' : '#000000'} 67.19%, rgba(255, 255, 255, 0) 100%)`,
            position: 'absolute',
            left: '20px',
            top: '42px',
          } : undefined
        }}>
          <Typography textAlign="center" fontSize={24} fontWeight={600}>{props.count}</Typography>
        </Box>
      </Box>
    )}
  </AppContext.Consumer>
);

const FeatureDescription = (props: { title: string, content: string }) => (
  <Stack spacing={2}>
    <Typography fontWeight={600} fontSize={24}>{props.title}</Typography>
    <Typography sx={{ opacity: 0.6 }}>{props.content}</Typography>
  </Stack>
);

const StepContent = (props: { title: string, subtitle?: string, imageSrc?: string, children?: React.ReactElement | React.ReactElement[] }) => (
  <Container>
    <Stack spacing={12} p={8}>
      <Stack spacing={4}>
        <Typography fontWeight={600} fontSize={52} textAlign="center">{props.title}</Typography>
        {props.subtitle && <Typography fontSize={18} textAlign="center" sx={{ opacity: 0.6 }}>{props.subtitle}</Typography>}
      </Stack>
      <Stack position="relative" direction="row" spacing={8}>
        {props.imageSrc && (
          <Box width="100%">
          </Box>
        )}
        {props.children && (
          <Stack width="100%" spacing={4}>
            {props.children}
          </Stack>
        )}
      </Stack>
    </Stack>
  </Container>
);

const Footer = () => (
  <AppContext.Consumer>
    {appState => (
      <Box sx={{ backgroundColor: appState.theme === 'light' ? "rgba(0,0,0,0.06)" : "rgba(125,125,125,0.2)" }}>
        <Divider />
        <Container maxWidth="lg">
          <Box component="footer" sx={{ padding: "64px 0 32px 0" }}>
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid item>
                    <Typography variant="h2" sx={{ pb: 2 }}>Projects</Typography>
                    <Stack>
                      <Link href="https://github.com/signalco-io/signalco">Website</Link>
                      <Link href="https://github.com/signalco-io/cloud">Cloud</Link>
                      <Link href="https://github.com/signalco-io/station">Station</Link>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Typography variant="h2" sx={{ pb: 2 }}>Community</Typography>
                    <Typography variant="caption" color="textSecondary">Coming soon...</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h2" sx={{ pb: 2 }}>Resources</Typography>
                    <Stack>
                      <Link href="https://status.signalco.io">Status</Link>
                      <Link href="https://storybook.dev.signalco.io">Storybook</Link>
                    </Stack>
                  </Grid>
                  <Grid item>
                    <Typography variant="h2" sx={{ pb: 2 }}>Legal</Typography>
                    <Stack>
                      <Link href="/legal/privacy-policy">Privacy Policy</Link>
                      <Link href="/legal/terms-of-service">Terms of Service</Link>
                      <Link href="/legal/dpa">DPA</Link>
                      <Link href="/legal/sla">SLA</Link>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Image src={appState.theme === 'light' ? "/images/icon-light-512x512.png" : "/images/icon-dark-512x144.png"} alt="Signalco logo" layout="fixed" width={239.37} height={68} />
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle2" fontWeight={400} component="span" color="textSecondary">Copyright © {new Date().getFullYear()} signalco. All rights reserved.</Typography>
                  </Grid>
                  <Grid item>
                    <Link href="https://github.com/signalco-io/signalco">
                      <IconButton size="large" aria-label="GitHub link">
                        <GitHubIcon />
                      </IconButton>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    )}
  </AppContext.Consumer>
);

const Index = () => (
  <Stack>
    <Cover />
    <Box m={8}>
      <Nav />
    </Box>
    <Box sx={{ margin: 'auto' }}>
      <CounterIndicator count={1} />
    </Box>
    <StepContent title="Discover">
      <FeatureDescription
        title="Integrations"
        content="Infinite possibilities. Check out many of our integrations." />
      <FeatureDescription
        title="Inpiration"
        content="" />
    </StepContent>
    <Box sx={{ margin: 'auto' }}>
      <CounterIndicator count={2} />
    </Box>
    <StepContent title="Play" />
    <Box sx={{ margin: 'auto' }}>
      <CounterIndicator count={3} hideAfter />
    </Box>
    <StepContent title="Enjoy">
      <FeatureDescription
        title="Anywhere you are"
        content="Access signalco from anywhere in the world and control all your devices and services from one app." />
    </StepContent>
    <Footer />
  </Stack >
);

export default Index;