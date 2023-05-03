import {Typography} from '@signalco/ui/dist/Typography';
import {Stack} from '@signalco/ui/dist/Stack';
import {Link} from '@signalco/ui/dist/Link';
import { type ChildrenProps } from '@signalco/ui';
import { KnownPages } from '../../src/knownPages';

export default function PostLayout({ children }: ChildrenProps) {
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
