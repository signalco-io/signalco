import React from 'react';
import Row from '@signalco/ui/dist/Row';
import Link from '@signalco/ui/dist/Link';
import Container from '@signalco/ui/dist/Container';
import { KnownPages } from '../src/knownPages';
import NavigatingButton from './NavigatingButton';
import SignalcoLogotype from './icons/SignalcoLogotype';

export const HeaderHeight = 80;

export default function PageNav({ fullWidth }: { fullWidth?: boolean | undefined; }) {
    return (
        <nav style={{
            borderBottom: '1px solid var(--joy-palette-background-body)',
            paddingTop: 16,
            paddingBottom: 16,
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            height: HeaderHeight,
            paddingLeft: fullWidth ? '24px' : 0,
            paddingRight: fullWidth ? '24px' : 0,
            backdropFilter: 'blur(10px)',
            zIndex: 101
        }}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div>
                            <Link href="/" aria-label="signalco">
                                <SignalcoLogotype height={42} />
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <NavigatingButton href={KnownPages.App}>App</NavigatingButton>
                        </Row>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
