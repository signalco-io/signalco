import { Container } from '@signalco/ui-primitives/Container';
import { PageNav } from '@signalco/ui/Nav';

export default function RootMarketingLayout({ children, }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PageNav fullWidth logo={'uier'} />
            <Container className="pt-20" maxWidth="lg">
                {children}
            </Container>
        </>
    );
}
