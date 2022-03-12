import { Box, Stack, Typography } from "@mui/material";
import Image, { ImageProps } from "next/image";
import SignalcoLogo from "../../icons/SignalcoLogo";

function RingLogo(props: { ringRadius: number, degrees: number, imageProps: ImageProps }) {
    const logoPadding = 16;

    const angle = (props.degrees + (-90)) * (Math.PI / 180);
    const logoWidth = props.imageProps.width as number;
    const logoHeight = props.imageProps.height as number;
    const x = props.ringRadius * Math.cos(angle);
    const y = props.ringRadius * Math.sin(angle);

    const top = y - logoHeight / 2 - logoPadding + props.ringRadius;
    const left = x - logoWidth / 2 - logoPadding + props.ringRadius;

    return (
        <Box sx={{
            p: `${logoPadding}px`,
            position: 'absolute',
            background: 'white',
            borderRadius: '50%',
            width: `${logoWidth + logoPadding * 2}px`,
            height: `${logoHeight + logoPadding * 2}px`,
            top: `${top}px`,
            left: `${left}px`
        }}>
            <Image priority alt={props.imageProps.alt} {...props.imageProps} />
        </Box>
    );
}

function Ring(props: { size: number, logos: RingLogoInfo[] }) {
    return (
        <Box sx={{ width: props.size, position: 'absolute', left: `calc(50% - ${props.size / 2}px + 154px)`, bottom: `-${props.size / 2 - 60}px` }}>
            <Box sx={{
                borderRadius: '50%',
                background: '#666',
                opacity: 0.1,
                mask: `radial-gradient(transparent ${props.size / 2 - 2}px,#000 ${props.size / 2 - 3}px)`,
                '&:before': {
                    content: '""',
                    display: 'block',
                    paddingTop: '100%'
                }
            }}></Box>
            {props.logos.map(logo => (
                <RingLogo key={logo.alt} ringRadius={props.size / 2} degrees={logo.angle} imageProps={logo} />
            ))}
        </Box>
    );
};

type RingLogoInfo = {
    angle: number,
    alt: string,
    src: string,
    width: number,
    height: number
}

const ringConfig = [
    {
        radius: 500,
        logos: [
            { angle: -30, alt: 'Xiaomi', src: "/assets/logos/xiaomilogo.png", width: 40, height: 40 },
            { angle: 60, alt: 'Zigbee2MQTT', src: "/assets/logos/z2mlogo.png", width: 60, height: 60 }
        ]
    },
    {
        radius: 900,
        logos: [
            { angle: -65, alt: 'Philips Hue', src: "/assets/logos/huelogo.png", width: 60, height: 60 },
            { angle: 15, alt: 'Samsung', src: "/assets/logos/samsunglogo.png", width: 90, height: 90 }
        ]
    },
    {
        radius: 1300,
        logos: [
            { angle: -45, alt: 'GitHub', src: "/assets/logos/githublogo.png", width: 70, height: 70 }
        ]
    },
    {
        radius: 1700,
        logos: [
            { angle: 60, alt: 'iRobot', src: "/assets/logos/irobotlogo.png", width: 70, height: 70 },
            { angle: -70, alt: 'Tasmota', src: "/assets/logos/tasmotalogo.png", width: 40, height: 40 }
        ]
    }
];

export default function Cover() {
    return (
        <Box sx={{ height: '50vh' }}>
            <Stack alignItems="stretch" justifyContent="end" sx={{ height: '100%', pb: 8 }}>
                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                    <SignalcoLogo width={400} />
                    {ringConfig.map(ring => (
                        <Ring key={ring.radius} size={ring.radius} logos={ring.logos} />
                    ))}
                </Box>
                <Typography component="h1" fontFamily="Raleway" fontWeight={200} textAlign="center" fontSize={{ xs: '1.4rem', sm: '2rem', lg: '2.5rem' }}>Automate your life</Typography>
            </Stack>
        </Box>
    );
}