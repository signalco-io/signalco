import { Box, Button, Card, CardHeader, CardMedia, Container, Divider, Grid, IconButton, Link, Typography } from "@material-ui/core";
import React from "react";
import GitHubIcon from '@material-ui/icons/GitHub';
import RippleIndicator from "../components/shared/indicators/RippleIndicator";
import { SxProps } from '@material-ui/system';
import { Theme } from '@material-ui/core/styles'
import { Cloud, Help, WifiLock } from "@material-ui/icons";

// const footerStyles = makeStyles({
//   root: {
//     '& ul': {


//       '&  li': {
//         listStyleType: 'none',
//         padding: '8px 0',

//         '& a': {
//           textDecoration: 'none',
//           outline: 'none',
//           color: 'rgba(255, 255, 255, 0.6)',
//           transition: 'color .1s ease',

//           '&:hover, &:active': {
//             color: 'rgba(255, 255, 255, 0.9)',
//           }
//         }
//       }
//     }
//   }
// });

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
                <Typography variant="h1">Signal</Typography>
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
                <Typography variant="h2">Projects</Typography>
                <ul>
                  <li><Link href="https://github.com/AleksandarDev/signalapp">Website</Link></li>
                  <li><Link href="https://github.com/AleksandarDev/signalapi">API</Link></li>
                  <li><Link href="https://github.com/AleksandarDev/beacon">Beacon</Link></li>
                </ul>
              </Grid>
              <Grid item>
                <Typography variant="h2">Community</Typography>

              </Grid>
              <Grid item>
                <Typography variant="h2">Resources</Typography>

              </Grid>
              <Grid item>
                <Typography variant="h2">Legal</Typography>
                <ul>
                  <li><Link href="/legal/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/legal/terms-of-service">Terms of Service</Link></li>
                  <li><Link href="/legal/dpa">DPA</Link></li>
                  <li><Link href="/legal/sla">SLA</Link></li>
                </ul>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <RippleIndicator size={52} interval={800} />
              </Grid>
              <Grid item>
                <Typography variant="h1" component="span" color="textSecondary">Signal</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems="flex-end" justifyContent="space-between">
              <Grid item>
                <Typography variant="subtitle2" color="textSecondary">Copyright © {new Date().getFullYear()} Aleksandar Toplek. All rights reserved.</Typography>
              </Grid>
              <Grid item>
                <Link href="https://github.com/AleksandarDev/signalapp">
                  <IconButton>
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
  return viaItem === 'cloud' ? (<Cloud />) : (viaItem === 'direct' ? <WifiLock /> : <Help />)
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

const Index = () => (
  <Grid container direction="column">
    <Grid item>
      <Onboarding />
    </Grid>
    <Grid item>
      <Pitch heading="Works with">
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <IntegrationCard
                name="Tuya"
                via={["z2m"]} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <IntegrationCard
                name="Ikea"
                via={["z2m"]} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <IntegrationCard
                name="Philips Hue"
                via={["z2m", 'direct', 'cloud']} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <IntegrationCard
                name="Samsung Smart TV's"
                via={["direct"]} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <IntegrationCard
                name="Broadlink"
                via={["direct"]} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <IntegrationCard
                name="Mi Home"
                via={["direct", 'cloud']} />
            </Grid>
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