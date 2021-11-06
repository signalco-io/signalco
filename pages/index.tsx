import { Box, Button, Container, Divider, Grid, IconButton, Link, Stack, Typography } from "@mui/material";
import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import Image from 'next/image';
import { AppContext } from "./_app";

const Onboarding = () => {
  return (
    <AppContext.Consumer>
      {appState => (
        <Stack>
          <Stack sx={{ pt: 24, pb: 12 }}>
            <Image src={appState.theme === 'light' ? "/images/icon-light-512x512.png" : "/images/icon-dark-512x144.png"} alt="Signalco logo" layout="fixed" width={512} height={144} />
            <Typography fontFamily="Raleway" fontWeight={200} fontSize={41}>Automate your life</Typography>
          </Stack>
          <Stack justifyContent="center" direction="row" sx={{ pt: 10 }}>
            <Button href="/app" size="large" variant="text" sx={{ width: '150px' }}>Automate</Button>
            <Button href="#" size="large" variant="text" sx={{ width: '150px' }}>Explore</Button>
            <Button href="#" size="large" variant="text" sx={{ width: '150px' }}>Community</Button>
          </Stack>
        </Stack>
      )}
    </AppContext.Consumer>
  );
};

const Footer = () => (
  <AppContext.Consumer>
    {appState => (
      <Box sx={{ backgroundColor: appState.theme === 'light' ? "rgba(0,0,0,0.06)" : "rgba(125,125,125,0.2)" }}>
        <Divider />
        <Container>
          <Box component="footer" sx={{ padding: "64px 0" }}>
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
    <Onboarding />
    <Footer />
  </Stack>
);

export default Index;