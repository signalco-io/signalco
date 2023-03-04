import React from 'react';
import Row from '@signalco/ui/dist/Row';
import Link from '@signalco/ui/dist/Link';
import Container from '@signalco/ui/dist/Container';
import InputGrabDomain from './InputGrabDomain';

export function PageNav({ fullWidth }: { fullWidth?: boolean | undefined; }) {
    return (
        <nav style={{
            borderBottom: '1px solid var(--joy-palette-background-body)',
            paddingTop: 16,
            paddingBottom: 16,
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            height: '80px',
            paddingLeft: fullWidth ? '24px' : 0,
            paddingRight: fullWidth ? '24px' : 0,
            backdropFilter: 'blur(10px)',
            zIndex: 101
        }}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div>
                            <Link href="/" aria-label="BrandGrab.io">
                                BrandGrab.io
                            </Link>
                        </div>
                        <InputGrabDomain placeholder="any-domain.com" />
                        <div></div>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
