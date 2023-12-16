import { PropsWithChildren } from 'react';
import {Typography} from '@signalco/ui-primitives/Typography';
import {Stack} from '@signalco/ui-primitives/Stack';
import {Link} from '@signalco/ui-primitives/Link';
import { KnownPages } from '../../src/knownPages';

export default function PostLayout({ children }: PropsWithChildren) {
    return (
        <div style={{ paddingTop: 12 }}>
            <Stack spacing={8}>
                <Link href={KnownPages.Blog}><Typography secondary>← Back to Blog</Typography></Link>
                <div>
                    {children}
                </div>
            </Stack>
        </div>
    );
}
