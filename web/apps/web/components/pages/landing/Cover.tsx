import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Box } from '@signalco/ui/dist/Box';
import SignalcoLogotype from '../../icons/SignalcoLogotype';

const ringConfig = [
    {
        radius: 500,
        logos: [
            { id: 'mi', angle: 120, alt: 'Xiaomi', src: '/assets/logos/xiaomilogo.png', width: 40, height: 40 },
            { id: 'zigbee2mqtt', angle: 50, alt: 'Zigbee2MQTT', src: '/assets/logos/z2mlogo.png', width: 60, height: 60 },
        ]
    },
    {
        radius: 900,
        logos: [
            { id: 'philipshue', angle: 140, alt: 'Philips Hue', src: '/assets/logos/huelogo.png', width: 60, height: 60 },
            { id: 'samsung', angle: 80, alt: 'Samsung', src: '/assets/logos/samsunglogo.png', width: 90, height: 90 }
        ]
    },
    {
        radius: 1300,
        logos: [
            { id: 'irobot', angle: 30, alt: 'iRobot', src: '/assets/logos/irobotlogo.png', width: 70, height: 70 },
            { id: 'github', angle: 120, alt: 'GitHub', src: '/assets/logos/githublogo.png', width: 70, height: 70 }
        ]
    },
    {
        radius: 1700,
        logos: [
            { id: 'tasmota', angle: 0, alt: 'Tasmota', src: '/assets/logos/tasmotalogo.png', width: 40, height: 40 }
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
    const logoWidth = props.imageProps.width as number;
    const logoHeight = props.imageProps.height as number;

    return (
        <Link href={`/channels/${props.imageProps.id}`} passHref aria-label={props.imageProps.alt} >
            <Box component="span" style={{
                padding: `${logoPadding}px`,
                backgroundColor: 'background.default',
                width: `${logoWidth + logoPadding * 2}px`,
                height: `${logoHeight + logoPadding * 2}px`,
                top: `${-logoHeight / 2 - logoPadding + props.ringRadius}px`,
                left: `${-logoWidth / 2 - logoPadding + props.ringRadius}px`,
                borderRadius: '50%',
                position: 'absolute',
                opacity: 0,
                animation: `scaleRingLogo${props.imageProps.id} 0.5s ease-in forwards, rotateRingLogo${props.imageProps.id} 12s ease-in-out infinite alternate`,
                animationDelay: '0.4s',
                [`@keyframes scaleRingLogo${props.imageProps.id}`]: {
                    to: { opacity: 1 }
                },
                [`@keyframes rotateRingLogo${props.imageProps.id}`]: {
                    from: { transform: `rotate(${-props.degrees - (props.degrees * props.ringRadius) / 10000}deg) translateX(${props.ringRadius}px) rotate(${props.degrees + (props.degrees * props.ringRadius) / 10000}deg)` },
                    to: { transform: `rotate(${-props.degrees}deg) translateX(${props.ringRadius * 1.02}px) rotate(${props.degrees}deg)` }
                },
                zIndex: 1
            }}>
                <Image
                    alt={props.imageProps.alt}
                    width={props.imageProps.width}
                    height={props.imageProps.height}
                    src={props.imageProps.src} />
            </Box>
        </Link>
    );
}

function Ring(props: { size: number, logos: RingLogoInfo[] }) {
    return (
        <Box sx={{ width: props.size, position: 'absolute', left: `calc(50% - ${props.size / 2 - 100}px)`, bottom: `-${props.size / 2 - 40}px` }}>
            <Box sx={{
                borderRadius: '50%',
                background: 'linear-gradient(200deg, rgba(127,127,127,1) 40%, rgba(0,0,0,0) 60%)',
                opacity: 0,
                transform: 'scale(0.8)',
                animation: 'scaleRing 1s cubic-bezier(0.33, 1, 0.68, 1) forwards, scaleRingGentle 12s ease-in-out infinite alternate',
                animationDelay: '0s, 1s',
                mask: `radial-gradient(transparent ${props.size / 2 - 3}px, #000 ${props.size / 2 - 2}px)`,
                willChange: 'transform, opacity',
                '&:before': {
                    content: '""',
                    display: 'block',
                    paddingTop: '100%'
                },
                '@keyframes scaleRing': {
                    to: { transform: 'scale(1)', opacity: 0.6 }
                },
                '@keyframes scaleRingGentle': {
                    from: { transform: 'scale(1)' },
                    to: { transform: 'scale(1.02)' }
                },
                userSelect: 'none'
            }}></Box>
            {props.logos.map(logo => (
                <RingLogo key={logo.alt} ringRadius={props.size / 2} degrees={logo.angle} imageProps={logo} />
            ))}
        </Box>
    );
}

export default function Cover() {
    return (
        <div style={{ height: '60vh' }}>
            <Stack alignItems="center" justifyContent="end" style={{ height: '100%', paddingBottom: 8 * 8 }}>
                <div style={{ position: 'relative' }}>
                    <SignalcoLogotype width={250} />
                    <Box sx={{
                        transform: { xs: 'scale(50%)', sm: 'scale(80%)', md: 'scale(1)' },
                        transformOrigin: { xs: '200px -40px', sm: 'center' }
                    }}>
                        {ringConfig.map(ring => (
                            <Ring key={ring.radius} size={ring.radius} logos={ring.logos} />
                        ))}
                    </Box>
                </div>
                <Typography
                    level="h1"
                    thin
                    fontSize="1.4rem">
                    Automate your life
                </Typography>
            </Stack>
        </div>
    );
}
