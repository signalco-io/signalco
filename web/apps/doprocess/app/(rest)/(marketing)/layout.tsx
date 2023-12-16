import { Container } from '@signalco/ui-primitives/Container';
import { PageNav } from '../../../components/PageNav';

export default function RootMarketingLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PageNav fullWidth />
            <Container className="pt-20" maxWidth="lg">
                {children}
            </Container>
        </>
    );
}
