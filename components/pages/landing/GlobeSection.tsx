import { Container, Box, NoSsr } from '@mui/material';
import dynamic from 'next/dynamic';
const Globe = dynamic(() => import('./Globe'));

function GlobeSection() {
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
                        <NoSsr>
                            <Globe />
                        </NoSsr>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default GlobeSection;