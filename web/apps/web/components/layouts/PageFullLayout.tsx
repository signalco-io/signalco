import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui/dist/Stack';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <Stack spacing={4}>
            <PageNav fullWidth />
            <div style={{ paddingTop: '80px' }}>
                {props.children}
            </div>
            <Footer />
        </Stack>
    );
}
