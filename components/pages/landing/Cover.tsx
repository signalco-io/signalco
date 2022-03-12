import { Box, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../pages/_app";
import Image from 'next/image';
import logoLight from '../../../public/images/icon-light-512x512.png';
import logoDark from '../../../public/images/icon-dark-512x144.png';

export default function Cover() {
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
                height: '50vh', display: 'flex', alignItems: 'center', px: '10%', pt: '10vh'
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
}