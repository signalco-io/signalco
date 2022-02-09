import { Alert, Box, Button, Container, Fade, FilledInput, Slide, Stack, Typography } from "@mui/material";
import React, { ChangeEvent, SyntheticEvent, useContext } from "react";
import Image from 'next/image';
import { AppContext } from "./_app";
import logoLight from '../public/images/icon-light-512x512.png';
import logoDark from '../public/images/icon-dark-512x144.png';
import Link from "next/link";
import Footer from "../components/pages/Footer";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { LoadingButton } from "@mui/lab";
import HttpService from "../src/services/HttpService";
import { blue } from "@mui/material/colors";

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
          left: '20px',
          top: '42px',
        } : undefined
      }}>
        <Typography textAlign="center" fontSize={23} fontWeight={600}>{props.count}</Typography>
      </Box>
    </Box>
  );
};

const FeatureDescription = (props: { title: string, content: string, link?: string }) => (
  <Stack spacing={2}>
    <Typography fontWeight={600} variant="h2">{props.title}</Typography>
    <Typography sx={{ opacity: 0.6 }}>{props.content}</Typography>
    <Box>
      {props.link && (
        <Link passHref href={props.link}>
          <Button variant="outlined">Read more</Button>
        </Link>
      )}
    </Box>
  </Stack>
);

const StepContent = (props: { title: string, subtitle?: string, imageSrc?: string, children?: React.ReactElement | React.ReactElement[] }) => (
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
          <Stack width="100%" spacing={4}>
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
            <Typography variant="h2">Subscribe</Typography>
            <Stack spacing={1} ref={errorContainerRef}>
              <Typography sx={{ opacity: 0.6 }}>{"We'll get back to you with awesome news and updates."}</Typography>
              <Fade in={!showSuccess}>
                <Stack direction="row" alignItems="stretch">
                  <FilledInput
                    disabled={isLoading}
                    type="email"
                    placeholder="example@example.com"
                    hiddenLabel
                    fullWidth
                    required
                    sx={{ borderRadius: '8px 0 0 8px' }}
                    value={email}
                    onChange={handleOnEmail} />
                  <LoadingButton loading={isLoading} type="submit" variant="outlined" size="large" sx={{ borderRadius: '0 8px 8px 0' }} disableElevation>Subscribe</LoadingButton>
                </Stack>
              </Fade>
              <Slide in={error != null} direction="down" container={errorContainerRef.current}>
                <Alert severity="error" variant="outlined">{error}</Alert>
              </Slide>
              <Fade in={showSuccess}>
                <Alert severity="success">You are our favorite subscriber</Alert>
              </Fade>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

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
        title="Inspiration"
        content="" />
    </StepContent>
    <Box sx={{ margin: 'auto' }}>
      <CounterIndicator count={2} />
    </Box>
    <StepContent title="Play" subtitle="test123">
      <FeatureDescription
        title="Visualize"
        content=""
        link="/features/dashboards" />
    </StepContent>
    <Box sx={{ margin: 'auto' }}>
      <CounterIndicator count={3} hideAfter />
    </Box>
    <StepContent title="Enjoy">
      <FeatureDescription
        title="Anywhere you are"
        content="Access signalco from anywhere in the world and control all your devices and services from one app." />
    </StepContent>
    <Box py={8}>
      <Newsletter />
    </Box>
    <Footer />
  </Stack >
);

export default Index;