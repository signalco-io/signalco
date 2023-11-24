import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

export function PageFullLayout(props: PropsWithChildren) {
    return (
        <Stack spacing={4}>
            <PageNav fullWidth />
            <div className="pt-20">
                {props.children}
            </div>
            <Footer />
        </Stack>
    );
}
