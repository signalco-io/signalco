'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Fade } from '@signalco/ui/dist/Fade';
import { Container } from '@signalco/ui/dist/Container';
import { Box } from '@signalco/ui/dist/Box';
import { useIsServer, useTimeout } from '@signalco/hooks';
const Globe = dynamic(() => import('./Globe'));

function GlobeSection() {
    const [appear, setAppear] = useState(false);
    useTimeout(() => setAppear(true), 100);

    const isServer = useIsServer();

    return (
        <Container>
            <Fade duration={2000} appear={appear}>
                <div className="overflow-hidden">
                    <div className="min-h-12 flex justify-center relative">
                        <Box sx={{
                            position: 'absolute',
                            transform: 'translateY(-8%)',
                            width: '1100px',
                            height: '1100px',
                            maxWidth: '100vw!important',
                            maxHeight: '100vw!important'
                        }}>
                            {!isServer && (
                                <Globe />
                            )}
                        </Box>
                    </div>
                </div>
            </Fade>
        </Container>
    );
}

export default GlobeSection;
