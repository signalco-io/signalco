import { PropsWithChildren, JSX } from 'react';
import {Typography} from '@signalco/ui-primitives/Typography';
import {Row} from '@signalco/ui-primitives/Row';

function H1({ children }: PropsWithChildren) {
    return <Typography level="h1">{children}</Typography>;
}

function H2({ children }: PropsWithChildren) {
    return <Typography level="h2">{children}</Typography>;
}

function H3({ children }: PropsWithChildren) {
    return <Typography level="h3">{children}</Typography>;
}

function H4({ children }: PropsWithChildren) {
    return <Typography level="h4">{children}</Typography>;
}

function H5({ children }: PropsWithChildren) {
    return <Typography level="h5">{children}</Typography>;
}

function H6({ children }: PropsWithChildren) {
    return <Typography level="h6">{children}</Typography>;
}

function P({ children }: PropsWithChildren) {
    return <Typography level="body1" gutterBottom>{children}</Typography>;
}

function Li({ children }: PropsWithChildren) {
    return (
        <Row spacing={1} style={{ marginBottom: 8 }} alignItems="start">
            <Typography tertiary>&ndash;</Typography>
            <Typography level="body1">{children}</Typography>
        </Row>
    );
}

function Ul({ children }: PropsWithChildren) {
    return <ul style={{ paddingBottom: 4 }}>{children}</ul>;
}

export function useMDXComponents(components: JSX.Element) {
    return { h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6, p: P, li: Li, ul: Ul, ...components };
}
