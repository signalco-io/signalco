import { Box, Stack, Typography } from "@mui/material";
import Image, { ImageProps } from "next/image";
import SignalcoLogotype from "../../icons/SignalcoLogotype";

const ringConfig = [
    {
        radius: 500,
        logos: [
            { angle: -30, alt: 'Xiaomi', src: "/assets/logos/xiaomilogo.png", width: 40, height: 40 },
            { angle: 50, alt: 'Zigbee2MQTT', src: "/assets/logos/z2mlogo.png", width: 60, height: 60 }
        ]
    },
    {
        radius: 900,
        logos: [
            { angle: -60, alt: 'Philips Hue', src: "/assets/logos/huelogo.png", width: 60, height: 60 },
            { angle: 15, alt: 'Samsung', src: "/assets/logos/samsunglogo.png", width: 90, height: 90 }
        ]
    },
    {
        radius: 1300,
        logos: [
            { angle: -10, alt: 'iRobot', src: "/assets/logos/irobotlogo.png", width: 70, height: 70 },
            { angle: -45, alt: 'GitHub', src: "/assets/logos/githublogo.png", width: 70, height: 70 }
        ]
    },
    {
        radius: 1700,
        logos: [
            { angle: -65, alt: 'Tasmota', src: "/assets/logos/tasmotalogo.png", width: 40, height: 40 }
        ]
    },
    {
        radius: 2100,
        logos: [
        ]
    }
];

type RingLogoInfo = {
    angle: number,
    alt: string,
    src: string,
    width: number,
    height: number
}

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
            backgroundColor: 'background.default',
            borderRadius: '50%',
            width: `${logoWidth + logoPadding * 2}px`,
            height: `${logoHeight + logoPadding * 2}px`,
            top: `${top}px`,
            left: `${left}px`
        }}>
            <Image alt={props.imageProps.alt} {...props.imageProps} />
        </Box>
    );
}

function Ring(props: { size: number, logos: RingLogoInfo[] }) {
    const offsetX = -100;
    const offsetY = -40;

    return (
        <Box sx={{ width: props.size, position: 'absolute', left: `calc(50% - ${props.size / 2 + offsetX}px)`, bottom: `-${props.size / 2 + offsetY}px` }}>
            <Box sx={{
                borderRadius: '50%',
                background: 'linear-gradient(200deg, rgba(127,127,127,1) 40%, rgba(0,0,0,0) 60%)',
                opacity: 0.6,
                mask: `radial-gradient(transparent ${props.size / 2 - 3}px, #000 ${props.size / 2 - 2}px)`,
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

export default function Cover() {
    return (
        <Box sx={{ height: '60vh' }}>
            <Stack alignItems="center" justifyContent="end" sx={{ height: '100%', pb: 8 }}>
                <Box sx={{ position: 'relative' }}>
                    <SignalcoLogotype priority width={250} />
                    <Box sx={{ transform: { xs: 'scale(50%)', sm: 'scale(80%)', md: 'scale(1)' }, transformOrigin: { xs: '200px -40px', sm: 'center' } }}>
                        {ringConfig.map(ring => (
                            <Ring key={ring.radius} size={ring.radius} logos={ring.logos} />
                        ))}
                    </Box>
                </Box>
                <Typography component="h1" fontFamily="Raleway" fontWeight={200} fontSize={{ xs: '1.3rem', sm: '1.7rem', lg: '2rem' }}>Automate your life</Typography>
            </Stack>
        </Box>
    );
}
