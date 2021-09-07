import { Box, Button, Card, CardHeader, CardMedia, Container, Divider, Grid, IconButton, Link, Stack, Typography } from "@mui/material";
import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import RippleIndicator from "../components/shared/indicators/RippleIndicator";
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles'
import { Cloud, Help, WifiLock } from "@mui/icons-material";
import ZigbeeLogoIcon from "../components/icons/ZigbeeLogoIcon";

const Pitch = (props: { sx?: SxProps<Theme>, heading: string, children: React.ReactChild }) => (
  <Box component="section" sx={{ textAlign: 'center', ...props.sx }}>
    <Box sx={{ py: 12 }}>
      <Typography variant="h1" component="h2" sx={{ my: 8 }}>{props.heading}</Typography>
      {props.children}
    </Box>
  </Box>
)

const Onboarding = () => {
  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="center" direction="column" spacing={10} wrap="nowrap" sx={{ pt: 24 }}>
          <Grid item>
            <Grid container alignItems="center" spacing={3} wrap="nowrap">
              <Grid item>
                <RippleIndicator size={72} interval={1200} />
              </Grid>
              <Grid item>
                <Typography variant="h1">Signalco</Typography>
              </Grid>
              <Grid item>
                <Box sx={{ width: '72px', height: '72px' }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={4} justifyContent="center">
              <Grid item>
                <Button href="/app" size="large" variant="contained">Automate</Button>
              </Grid>
              <Grid item>
                <Button href="#" size="large" variant="outlined">Learn More</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <div>{/* image */}</div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const Footer = () => (
  <Box sx={{ backgroundColor: "rgba(125,125,125,0.2)" }}>
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
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <RippleIndicator size={52} interval={800} />
              </Grid>
              <Grid item>
                <Typography variant="h1" component="span" color="textSecondary">Signalco</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems="flex-end" justifyContent="space-between">
              <Grid item>
                <Typography variant="subtitle2" color="textSecondary">Copyright © {new Date().getFullYear()} Signalco. All rights reserved.</Typography>
              </Grid>
              <Grid item>
                <Link href="https://github.com/signalco-io/signalco">
                  <IconButton size="large">
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
);

const IntegrationViaIcon = ({ viaItem }: { viaItem: string }) => {
  if (viaItem === "z2m")
    return <span title="Zigbee2MQTT"><ZigbeeLogoIcon /></span>;
  else if (viaItem === "cloud")
    return <span title="Cloud"><Cloud /></span>;
  else if (viaItem === 'direct')
    return <span title="Direct"><WifiLock /></span>;
  return <Help />;
};

const IntegrationCard = (props: { name: string, via: string[] }) => (
  <Card sx={{ minWidth: '220px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} variant="outlined">
    <CardHeader title={props.name} />
    <CardMedia>
      <Grid container spacing={1} sx={{ px: 2, py: 1, opacity: 0.6 }}>
        {props.via.map(viaItem =>
          <Grid item key={`viaItem-${viaItem}`}>
            <IntegrationViaIcon viaItem={viaItem} />
          </Grid>
        )}
      </Grid>
    </CardMedia>
  </Card>
);

const integrations = [
  { name: "Tuya", channels: ["z2m"] },
  { name: "Ikea", channels: ["z2m"] },
  { name: "Philips Hue", channels: ["z2m", 'direct', 'cloud'] },
  { name: "Samsung Smart TV's", channels: ["direct"] },
  { name: "Broadlink", channels: ["z2m"] },
  { name: "Mi Home", channels: ["direct", "cloud"] }
];

const Index = () => (
  <Grid container direction="column">
    <Grid item>
      <Onboarding />
    </Grid>
    <Grid item>
      <Pitch heading="Works with">
        <Container>
          <Grid container spacing={3}>
            {integrations.map(i => (
              <Grid item xs={12} sm={6} md={4} key={`integration-${i.name}`}>
                <IntegrationCard
                  name={i.name}
                  via={i.channels} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Pitch>
    </Grid>
    <Grid item>
      <Footer />
    </Grid>
  </Grid>
);

export default Index;