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
    <Container>
      <Stack alignItems="center" justifyContent="center" sx={{ pt: 24 }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <RippleIndicator size={72} interval={1200} />
          <Typography variant="h1">Signalco</Typography>
          <Box sx={{ width: '72px', height: '72px' }} />
        </Stack>
        <Stack justifyContent="center" direction="row" sx={{ pt: 10 }}>
          <Button href="/app" size="large" variant="contained" sx={{ mr: 4 }}>Automate</Button>
          <Button href="#" size="large" variant="outlined">Learn More</Button>
        </Stack>
        <div>{/* image */}</div>
      </Stack>
    </Container>
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
                <Typography variant="subtitle2" component="span" color="textSecondary">Copyright © {new Date().getFullYear()} Signalco. All rights reserved.</Typography>
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
);

const IntegrationViaIcon = ({ viaItem }: { viaItem: string }) => {
  if (viaItem === "z2m")
    return <span title="Zigbee2MQTT"><ZigbeeLogoIcon /></span>;
  else if (viaItem === "cloud")
    return <span title="Cloud"><Cloud /></span>;
  else if (viaItem === 'direct')
    return <span title="Direct"><WifiLock /></span>;
  else if (viaItem === 'philipsHue')
    return (<span title="Philips Hue" style={{ fill: 'currentcolor', width: '24px' }}>
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Philips Hue</title><path d="M20.672 9.6c-2.043 0-3.505 1.386-3.682 3.416h-.664c-.247 0-.395.144-.395.384 0 .24.148.384.395.384h.661c.152 2.09 1.652 3.423 3.915 3.423.944 0 1.685-.144 2.332-.453.158-.075.337-.217.292-.471a.334.334 0 0 0-.15-.242c-.104-.065-.25-.072-.422-.02a7.93 7.93 0 0 0-.352.12c-.414.146-.771.273-1.599.273-1.75 0-2.908-1.023-2.952-2.605v-.025h5.444c.313 0 .492-.164.505-.463v-.058C23.994 9.865 21.452 9.6 20.672 9.6zm2.376 3.416h-5l.004-.035c.121-1.58 1.161-2.601 2.649-2.601 1.134 0 2.347.685 2.347 2.606zM9.542 10.221c0-.335-.195-.534-.52-.534s-.52.2-.52.534v2.795h1.04zm4.29 3.817c0 1.324-.948 2.361-2.16 2.361-1.433 0-2.13-.763-2.13-2.333v-.282h-1.04v.34c0 2.046.965 3.083 2.868 3.083 1.12 0 1.943-.486 2.443-1.445l.02-.036v.861c0 .334.193.534.519.534.325 0 .52-.2.52-.534v-2.803h-1.04zm.52-4.351c-.326 0-.52.2-.52.534v2.795h1.04v-2.795c0-.335-.195-.534-.52-.534zM3.645 9.6c-1.66 0-2.31 1.072-2.471 1.4l-.135.278V7.355c0-.347-.199-.562-.52-.562-.32 0-.519.215-.519.562v5.661h1.039v-.015c0-1.249.72-2.592 2.304-2.592 1.29 0 2.001.828 2.001 2.332v.275h1.04v-.246c0-2.044-.973-3.17-2.739-3.17zM0 16.558c0 .347.199.563.52.563.32 0 .519-.216.519-.563v-2.774H0zm5.344 0c0 .347.2.563.52.563s.52-.216.52-.563v-2.774h-1.04z" /></svg>
    </span>);
  return <Help />;
};

const IntegrationCard = (props: { name: string, via: string[] }) => (
  <Card sx={{ minWidth: '220px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} variant="outlined">
    <CardHeader title={props.name} />
    <CardMedia>
      <Stack direction="row" spacing={1} sx={{ px: 2, py: 1, opacity: 0.6 }}>
        {props.via.map(viaItem =>
          <IntegrationViaIcon key={`viaItem-${viaItem}`} viaItem={viaItem} />
        )}
      </Stack>
    </CardMedia>
  </Card>
);

const integrations = [
  { name: "Tuya", channels: ["z2m"] },
  { name: "Ikea", channels: ["z2m"] },
  { name: "Philips Hue", channels: ['philipsHue', "z2m", 'cloud'] },
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