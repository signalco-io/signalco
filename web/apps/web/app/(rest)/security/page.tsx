import { Shield, Lock, Euro } from '@signalco/ui-icons';
import { Stack } from '@signalco/ui/dist/Stack';
import { Card, CardContent } from '@signalco/ui/dist/Card';
import { Avatar } from '@signalco/ui/dist/Avatar';
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import FaqSection from '../../../components/pages/FaqSection';
import { Container } from '@signalco/ui/dist/Container';
import CtaSection from '../../../components/pages/CtaSection';

const securityFaq = [
    {
        id: 'isSignalcoSecure',
        question: 'Is signalco secure?',
        answer: 'Yes. We take security very seriously. We use industry standard security practices to ensure your data is safe.'
    },
    {
        id: 'gdprConpliant',
        question: 'Is signalco GDPR compliant?',
        answer: 'Yes. We are fully GDPR compliant. We only store data that is required to provide our services and you opt-in to provide to us. For more details about see our privacy policy.'
    },
    {
        id: 'dataOwnership',
        question: 'Who owns my data?',
        answer: 'You own your data. We only store data that is required to provide our services and you opt-in to provide to us. You can at any time request to delete your data from signalco. For more details about see our privacy policy.'
    },
    {
        id: 'dataEncryption',
        question: 'Is my data encrypted?',
        answer: 'Yes. All data is encrypted in transit (HTTPS/TLS) and at rest (AES-256).'
    },
    {
        id: 'dataStorage',
        question: 'Where is my data stored?',
        answer: 'Your data is stored in the West Europe. We are using Azure cloud services to store your data. We are working on adding more regions in the future.'
    }
];

const securityShortFeatures = [
    {
        icon: <Lock />,
        header: 'Encrypted by default',
        description: 'All data is encrypted in transit (HTTPS/TLS) and at rest (AES-256).'
    },
    {
        icon: <Euro />,
        header: 'GDPR compliant',
        description: 'We are fully GDPR compliant, both in EU and globally.'
    },
    {
        icon: <Shield />,
        header: 'Data storage',
        description: 'Your data is stored in the West Europe in Microsoft Azure data centers.'
    }
];

function InformationalCardShort({ icon, header, description }: { icon?: React.ReactNode, header: string, description: string }) {
    return (
        <Card>
            <CardContent>
                <div className="flex flex-row pt-6">
                    {icon && (
                        <Avatar className="mr-4">
                            {icon}
                        </Avatar>
                    )}
                    <div>
                        <h2 className="text-xl font-bold">{header}</h2>
                        <p className="text-gray-600">{description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function SecurityPage() {
    return (
        <Stack spacing={8}>
            <Container maxWidth="xs">
                <PageCenterHeader level="h1" header="Security" subHeader="We take security very seriously. We use industry standard security practices to ensure your data is safe." />
            </Container>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {securityShortFeatures.map((feature) => (
                    <InformationalCardShort
                        key={feature.header}
                        icon={feature.icon}
                        header={feature.header}
                        description={feature.description}
                    />
                ))}
            </div>
            <FaqSection faq={securityFaq} />
            <CtaSection />
        </Stack>
    );
}
