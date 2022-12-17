'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import useIsClient from '@signalco/ui/src/hooks/useIsClient';
import { Container, Box, Fade } from '@signalco/ui';
import useTimeout from '../../../src/hooks/useTimeout';
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
