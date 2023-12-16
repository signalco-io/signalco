import React, { type CSSProperties } from 'react';
import {Container} from '@signalco/ui-primitives/Container';

export function SectionCenter(props: { children?: React.ReactNode | undefined; style?: CSSProperties | undefined; narrow?: boolean; }) {
    return (
        <section style={props.style}>
            <Container>
                <div style={{ paddingLeft: 4*8, paddingRight: 4*8, paddingTop: (props.narrow ? 4 : 12) * 8, paddingBottom: (props.narrow ? 4 : 12) * 8 }}>
                    {props.children}
                </div>
            </Container>
        </section>
    );
}
