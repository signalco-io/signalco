import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Container , Box } from '@signalco/ui';
import useTimeout from 'src/hooks/useTimeout';
import useIsClient from 'src/hooks/useIsClient';
import Fade from 'components/shared/animations/Fade';
const Globe = dynamic(() => import('./Globe'));

function GlobeSection() {
    const [appear, setAppear] = useState(false);
    useTimeout(() => setAppear(true), 100);

    const isClient = useIsClient();

    return (
        <Container>
            <Fade duration={2000} appear={appear}>
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
                            {isClient && (
                                <Globe />
                            )}
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Container>
    );
}

export default GlobeSection;
