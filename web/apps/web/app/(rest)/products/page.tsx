import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Card } from '@signalco/ui-primitives/Card';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';

const products = [
    { id: 'signalco', tags: ['platform'], name: 'signalco', logo: 'https://www.signalco.io/images/icon_x512.png', url: 'https://www.signalco.io' },
    { id: 'workingparty', tags: ['platform'], name: 'WorkingParty', logo: 'https://workingparty.ai/android-chrome-192x192.png', url: 'https://workingparty.ai' },
    { id: 'doprocess', tags: ['platform'], name: 'do process', logo: 'https://doprocess.app/android-chrome-192x192.png', url: 'https://doprocess.app' },
    { id: 'slco', tags: ['platform'], name: 'slco', logo: undefined, url: 'https://slco.io' },
    { id: 'brandgrab', tags: ['platform'], name: 'Brand Grab', logo: undefined, url: 'https://brandgrab.io' },
    { id: 'uier', tags: ['platform'], name: 'UIer', logo: undefined, url: 'https://uier.io' },
    { id: 'modrobots', tags: ['platform'], name: 'MODROBOTS', logo: 'https://modrobots.com/android-chrome-192x192.png', url: 'https://modrobots.com' },

    { id: 'mutex', tags: ['apiaas'], name: 'Mutex', logo: undefined, url: 'https://mutex.api.signalco.io' },
    { id: 'remotebrowser', tags: ['apiaas'], name: 'Remote Browser', logo: undefined, url: 'https://browser.api.signalco.io' },

    { id: 'npm-ui-primitives', tags: ['npm'], name: '@signalco/ui-primitives', logo: undefined, url: 'https://www.npmjs.com/package/@signalco/ui-primitives' },
    { id: 'npm-ui-themes-minimal', tags: ['npm'], name: '@signalco/ui-themes-minimal', logo: undefined, url: 'https://www.npmjs.com/package/@signalco/ui-themes-minimal' },
    { id: 'npm-ui-themes-minimal-app', tags: ['npm'], name: '@signalco/ui-themes-minimal-app', logo: undefined, url: 'https://www.npmjs.com/package/@signalco/ui-themes-minimal-app' },
    { id: 'npm-ui-icons', tags: ['npm'], name: '@signalco/ui-icons', logo: undefined, url: 'https://www.npmjs.com/package/@signalco/ui-icons' },
    { id: 'npm-hooks', tags: ['npm'], name: '@signalco/hooks', logo: undefined, url: 'https://www.npmjs.com/package/@signalco/hooks' },
    { id: 'npm-js', tags: ['npm'], name: '@signalco/js', logo: undefined, url: 'https://www.npmjs.com/package/@signalco/js' },
];

function GridSection({ header, subHeader, tag }: { header: string, subHeader?: string, tag: string }) {
    return (
        <section>
            <PageCenterHeader secondary subHeader={subHeader}>
                {header}
            </PageCenterHeader>
            <div className="grid grid-cols-4 gap-12">
                {products.filter(p => p.tags.includes(tag)).map(product => (
                    <Card key={product.id}
                        className="flex aspect-square h-full items-center justify-center bg-cover bg-no-repeat bg-blend-color-dodge [background-color:#f3f3f3]"
                        style={{ backgroundImage: `url(${product.logo})` }}
                        href={product.url}>
                        <Typography level="h3">{product.name}</Typography>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function ListSection({ header, subHeader, tag }: { header: string, subHeader?: string, tag: string }) {
    return (
        <section>
            <PageCenterHeader secondary subHeader={subHeader}>
                {header}
            </PageCenterHeader>
            <Stack spacing={2}>
                {products.filter(p => p.tags.includes(tag)).map(product => (
                    <Card key={product.id} href={product.url}>
                        <Typography level="h6">{product.name}</Typography>
                    </Card>
                ))}
            </Stack>
        </section>
    );
}

export default function ProductsPage() {
    return (
        <Stack spacing={4}>
            <PageCenterHeader level="h1" subHeader="All our products in one place.">
                Products
            </PageCenterHeader>
            <GridSection header="Platforms" subHeader="Core products we provide and support." tag="platform" />
            <ListSection header="APIs" subHeader="Publically availble and open source APIs." tag="apiaas" />
            <ListSection header="NPM" subHeader="Packages for JavaScript ecosystem powering all our products." tag="npm" />
        </Stack>
    );
}