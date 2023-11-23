import React from 'react';
import { Link } from '@signalco/ui-primitives/Link';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';
import InputGrabDomain from './InputGrabDomain';

export function PageNav({ fullWidth }: { fullWidth?: boolean | undefined; }) {
    return (
        <nav className={cx(
            'backdrop-blur-md py-4 fixed top-0 left-0 right-0 z-10 h-20',
            fullWidth ? 'px-4' : 'px-0'
        )}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
                    <div>
                        <Link href="/" aria-label="BrandGrab.io">
                            BrandGrab.io
                        </Link>
                    </div>
                    <div>
                        <InputGrabDomain placeholder="any-domain.com" />
                    </div>
                    <div></div>
                </header>
            </Container>
        </nav>
    );
}
