import { Box, keyframes, Stack, Typography } from '@mui/material';
import Image, { ImageProps } from 'next/image';
import { useMemo } from 'react';
import SignalcoLogotype from '../../icons/SignalcoLogotype';
import styles from './Cover.module.scss';

const ringConfig = [
    {
        radius: 500,
        logos: [
            { angle: 120, alt: 'Xiaomi', src: '/assets/logos/xiaomilogo.png', width: 40, height: 40 },
            { angle: 50, alt: 'Zigbee2MQTT', src: '/assets/logos/z2mlogo.png', width: 60, height: 60 },
        ]
    },
    {
        radius: 900,
        logos: [
            { angle: 140, alt: 'Philips Hue', src: '/assets/logos/huelogo.png', width: 60, height: 60 },
            { angle: 80, alt: 'Samsung', src: '/assets/logos/samsunglogo.png', width: 90, height: 90 }
        ]
    },
    {
        radius: 1300,
        logos: [
            { angle: 30, alt: 'iRobot', src: '/assets/logos/irobotlogo.png', width: 70, height: 70 },
            { angle: 120, alt: 'GitHub', src: '/assets/logos/githublogo.png', width: 70, height: 70 }
        ]
    },
    {
        radius: 1700,
        logos: [
            { angle: 0, alt: 'Tasmota', src: '/assets/logos/tasmotalogo.png', width: 40, height: 40 }
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

const scaleRingLogoKeyframes = keyframes`
    to   { opacity: 1; }
`;

const rotateRingLogoKeyframes = (radius: number, degOffset: number, power: number) => keyframes`
    from    { transform: rotate(${-degOffset}deg) translateX(${radius}px) rotate(${degOffset}deg); }
    to      { transform: rotate(${-degOffset - power}deg) translateX(${radius * 1.02}px) rotate(${degOffset + power}deg); }
`;

function RingLogo(props: { ringRadius: number, degrees: number, imageProps: ImageProps }) {
    const logoPadding = 16;

    const logoWidth = props.imageProps.width as number;
    const logoHeight = props.imageProps.height as number;

    const top = -logoHeight / 2 - logoPadding + props.ringRadius;
    const left = -logoWidth / 2 - logoPadding + props.ringRadius;

    const power = useMemo(() => Math.random() > 0.5 ? 4 : -4, []);

    return (
        <Box className={styles.ringLogo} sx={{
            p: `${logoPadding}px`,
            backgroundColor: 'background.default',
            width: `${logoWidth + logoPadding * 2}px`,
            height: `${logoHeight + logoPadding * 2}px`,
            top: `${top}px`,
            left: `${left}px`,
            borderRadius: '50%',
            position: 'absolute',
            opacity: 0,
            animation: `${scaleRingLogoKeyframes} 0.5s ease-in, ${rotateRingLogoKeyframes(props.ringRadius, props.degrees, power)} 12s ease-in-out infinite`,
            animationDelay: '1s',
            animationFillMode: 'forwards',
            animationDirection: 'alternate',
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
            <Box className={styles.ringInner} sx={{
                mask: `radial-gradient(transparent ${props.size / 2 - 3}px, #000 ${props.size / 2 - 2}px)`,
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
                    <SignalcoLogotype width={250} />
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
