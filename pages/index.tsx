import { Alert, Box, Button, Collapse, Container, Fade, FilledInput, Grid, NoSsr, OutlinedInput, Slide, Stack, Typography } from "@mui/material";
import React, { ChangeEvent, SyntheticEvent, useContext, useEffect } from "react";
import Image from 'next/image';
import { AppContext } from "./_app";
import logoLight from '../public/images/icon-light-512x512.png';
import logoDark from '../public/images/icon-dark-512x144.png';
import Link from "next/link";
import Footer from "../components/pages/Footer";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { LoadingButton } from "@mui/lab";
import HttpService from "../src/services/HttpService";
import createGlobe from "cobe";
import useWindowRect from "../src/hooks/useWindowRect";
import { grey } from "@mui/material/colors";

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

const CounterIndicator = (props: { count: number, hideAfter?: boolean }) => {
  const appContext = useContext(AppContext);

  return (
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
          background: `linear-gradient(180deg, ${appContext.theme === 'dark' ? '#ffffff' : '#000000'} 67.19%, rgba(255, 255, 255, 0) 100%)`,
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
          background: `linear-gradient(180deg, ${appContext.theme === 'dark' ? '#ffffff' : '#000000'} 67.19%, rgba(255, 255, 255, 0) 100%)`,
          position: 'absolute',
          left: '21px',
          top: '42px',
        } : undefined
      }}>
        <Typography textAlign="center" fontSize={23} fontWeight={600}>{props.count}</Typography>
      </Box>
    </Box>
  );
};

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

const StepContent = (props: { title: string, subtitle?: string, imageSrc?: string, children?: React.ReactElement | React.ReactElement[], horizontal?: boolean }) => (
  <Container>
    <Stack spacing={12} p={8}>
      <Stack spacing={4}>
        <Typography fontWeight={600} fontSize={52} textAlign="center">{props.title}</Typography>
        {props.subtitle && <Typography textAlign="center" sx={{ opacity: 0.6 }}>{props.subtitle}</Typography>}
      </Stack>
      <Stack position="relative" direction="row" spacing={8}>
        {props.imageSrc && (
          <Box width="100%">
          </Box>
        )}
        {props.children && (
          <Stack width="100%" spacing={4} justifyContent="space-evenly" direction={props.horizontal ? "row" : "column"}>
            {props.children}
          </Stack>
        )}
      </Stack>
    </Stack>
  </Container>
);

const Newsletter = () => {
  const appContext = useContext(AppContext);
  const [email, setEmail] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const errorContainerRef = React.useRef<Element>(null);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const hcaptchaRef = React.createRef<HCaptcha>();

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    setIsLoading(true);

    // Execute the reCAPTCHA when the form is submitted
    hcaptchaRef.current?.execute();
  };

  const onHCaptchaChange = async (token: string | undefined) => {
    try {
      // If the HCAPTCHA code is null or undefined indicating that
      // the HCAPTCHA was expired then return early
      if (!token) {
        return;
      }

      // TODO: Submit request
      try {
        await HttpService.requestAsync(
          "/website/newsletter-subscribe",
          "post",
          { email: email },
          {
            "HCAPTCHA-RESPONSE": token
          },
          true
        );

        setShowSuccess(true);
      } catch (err) {
        console.error('Failed to subscribe to newsletter', err);
        setError('Failed to subscribe to newsletter');
      }

      // Reset the HCAPTCHA so that it can be executed again if user
      // submits another email.
      hcaptchaRef.current?.resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  const handleOnEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(undefined);
  }

  // Retrieve key, if not available don't show the component
  const key = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  if (typeof key === 'undefined') return <></>;

  return (
    <Container>
      <Box p={{ xs: 2, sm: 8 }}>
        <form onSubmit={handleSubmit}>
          <HCaptcha
            ref={hcaptchaRef}
            size="invisible"
            theme={appContext.theme === 'dark' ? 'dark' : 'light'}
            sitekey={key}
            onVerify={onHCaptchaChange}
            onClose={() => onHCaptchaChange(undefined)}
          />
          <Stack spacing={4}>
            <Typography variant="h2">{"What's new?"}</Typography>
            <Stack spacing={1} ref={errorContainerRef}>
              <Typography sx={{ opacity: 0.9 }}>{"We'll get back to you with awesome news and updates."}</Typography>
              <Collapse unmountOnExit in={!showSuccess}>
                <Stack direction="row" alignItems="stretch">
                  <OutlinedInput
                    disabled={isLoading}
                    type="email"
                    placeholder="you@email.com"
                    fullWidth
                    required
                    sx={{ borderRadius: '8px 0 0 8px', maxWidth: '400px' }}
                    value={email}
                    onChange={handleOnEmail} />
                  <LoadingButton loading={isLoading} type="submit" variant="outlined" size="large" sx={{ borderRadius: '0 8px 8px 0' }} disableElevation>Subscribe</LoadingButton>
                </Stack>
              </Collapse>
              <Slide unmountOnExit in={error != null} direction="down" container={errorContainerRef.current}>
                <Alert severity="error" variant="outlined">{error}</Alert>
              </Slide>
              <Fade unmountOnExit in={showSuccess}>
                <Alert severity="success" variant="outlined">You are our new favorite subscriber</Alert>
              </Fade>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

const Globe = () => {
  const canvasRef = React.useRef(null);
  const appContext = useContext(AppContext);
  const rect = useWindowRect(typeof window !== 'undefined' ? window : null);
  const width = Math.min(1100, rect?.width ?? 0);
  const height = width;
  const isDark = appContext.theme === 'dark';

  useEffect(() => {
    let phi = 4.1;

    if (!width || !height) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: height * 2,
      phi: phi,
      theta: 0.1,
      dark: isDark ? 1 : 0,
      diffuse: 1.1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: isDark ? [0.6, 0.6, 0.6] : [1, 1, 1],
      markerColor: [0.1, 0.8, 1],
      glowColor: isDark ? [0, 0, 0] : [1, 1, 1],
      markers: [],
      onRender: (state: any) => {
        state.phi = phi;
        phi += 0.0005;
      }
    });

    return () => {
      globe.destroy();
    };
  }, [width, height, isDark]);

  return (
    <Container>
      <Box sx={{
        overflow: 'hidden',
      }}>
        <Box sx={{
          minHeight: { xs: '12vh', sm: '20vh', md: '380px' },
          display: 'flex',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <Box sx={{
            position: 'absolute',
            transform: 'translateY(-8%)',
            width: '1100px',
            height: '1100px',
            maxWidth: '100vw!important',
            maxHeight: '100vw!important'
          }}>
            <canvas ref={canvasRef} style={{ width: width, height: width }}></canvas>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

const Index = () => {
  const appContext = useContext(AppContext);

  return (
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
          content="Infinite possibilities. We are connected with wide range of devices and service from many fields. Smart Home and IoT devices to productivity tools and social apps." />
        <FeatureDescription
          title="Inspiration"
          content="" />
      </StepContent>
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={2} />
      </Box>
      <StepContent title="Play">
        <FeatureDescription
          title="Dashboards"
          content="Make it yours. Visualize everything that matters to you in one place."
          link="/features/dashboards"
          linkText="See dashboards" />
        <FeatureDescription
          title="Processes"
          content=""
          link="/features/processes"
          linkText="Explore automation processes" />
      </StepContent>
      <Box sx={{ margin: 'auto' }}>
        <CounterIndicator count={3} hideAfter />
      </Box>
      <StepContent title="Enjoy" horizontal>
        <Grid container spacing={4} wrap="nowrap">
          <Grid item xs={4}>
            <FeatureDescription
              title="Anywhere you are"
              content="Access all features wherever you are. Controling devices in your home from other side of the world or room :) has never been simpler." />
          </Grid>
          <Grid item xs={4}>
            <FeatureDescription
              title="Share"
              content="Not just for you. Share dashboards, devices, media, everything connected, with anyone on signalco or publically. Invite with friends, family and coworkers. You are in full control over what others can see and do." />
          </Grid>
          <Grid item xs={4}>
            <FeatureDescription
              title="Relax"
              content="Enjoy the automated life. Use gained free time doing what you love. Relax in nature, hobbies, family... or automate one more thing." />
          </Grid>
        </Grid>
      </StepContent>
      <NoSsr>
        <Globe />
      </NoSsr>
      <Box py={8} sx={{ backgroundColor: grey[appContext.theme === 'dark' ? '900' : '300'] }}>
        <Newsletter />
      </Box>
      <Footer />
    </Stack>
  );
};

export default Index;