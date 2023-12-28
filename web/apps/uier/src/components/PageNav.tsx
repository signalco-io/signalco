import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';
import { KnownPages } from '../knownPages';
import { NavMenu } from './NavMenu';

export function PageNav({ fullWidth }: { fullWidth?: boolean }) {
    return (
        <nav className={cx(
            'backdrop-blur-md fixed top-0 left-0 right-0 z-10 h-16 border-b flex items-center',
            fullWidth ? 'px-4' : 'px-0'
        )}>
            <Container maxWidth="lg">
                <header>
                    <Row justifyContent="space-between">
                        <div className="flex h-full flex-col items-center">
                            <Link href={KnownPages.Landing}>
                                uier
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <NavMenu />
                        </Row>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
