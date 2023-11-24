import React, { type CSSProperties } from 'react';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';

export function SectionCenter(props: { children?: React.ReactNode | undefined; style?: CSSProperties | undefined; narrow?: boolean; className?: string; }) {
    return (
        <section className={props.className} style={props.style}>
            <Container>
                <div
                    className={cx(
                        'xs:px-1 sm:px-2 md:px-4',
                        props.narrow && 'xs:py-4 sm:py-4',
                        !props.narrow && 'xs:py-8 sm:py-12',
                    )}>
                    {props.children}
                </div>
            </Container>
        </section>
    );
}
